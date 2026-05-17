// Judge0 CE API integration via RapidAPI

const LANGUAGE_MAP = {
  "C++": 54,
  "Java": 62,
  "Python": 71,
  "JavaScript": 63,
};

const JUDGE0_URL = "https://judge0-ce.p.rapidapi.com";

const headers = {
  "Content-Type": "application/json",
  "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
  "X-RapidAPI-Host": process.env.JUDGE0_API_HOST,
};

export function getLanguageId(language) {
  return LANGUAGE_MAP[language] || 63;
}

export async function createSubmission(sourceCode, languageId, stdin = "") {
  try {
    const response = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=true&wait=false`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        source_code: Buffer.from(sourceCode).toString("base64"),
        language_id: languageId,
        stdin: Buffer.from(stdin).toString("base64"),
      }),
    });
    const data = await response.json();
    return data; // { token: "..." }
  } catch (error) {
    console.error("Judge0 create submission error:", error.message);
    throw error;
  }
}

export async function getSubmission(token) {
  try {
    const response = await fetch(
      `${JUDGE0_URL}/submissions/${token}?base64_encoded=true&fields=stdout,stderr,status,time,memory,compile_output`,
      { method: "GET", headers }
    );
    const data = await response.json();
    return {
      stdout: data.stdout ? Buffer.from(data.stdout, "base64").toString() : "",
      stderr: data.stderr ? Buffer.from(data.stderr, "base64").toString() : "",
      compileOutput: data.compile_output ? Buffer.from(data.compile_output, "base64").toString() : "",
      status: data.status,
      time: data.time,
      memory: data.memory,
    };
  } catch (error) {
    console.error("Judge0 get submission error:", error.message);
    throw error;
  }
}

// Poll until Judge0 finishes processing (status.id <= 2 means queued/processing)
export async function executeCode(sourceCode, language, stdin = "") {
  const languageId = getLanguageId(language);
  const { token } = await createSubmission(sourceCode, languageId, stdin);

  if (!token) throw new Error("Failed to create Judge0 submission");

  // Poll for result
  let result;
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    result = await getSubmission(token);
    if (result.status && result.status.id > 2) break;
  }

  return result;
}
