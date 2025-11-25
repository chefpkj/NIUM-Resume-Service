export interface ParsedName {
  first: string;
  last: string;
}

export interface UploadResumePayload {
  name: string;
  current_job_title: string;
  current_job_description: string;
  current_job_company: string;
}

export interface ValidatedUploadPayload {
  parsedName: ParsedName;
  current_job_title: string;
  current_job_description: string;
  current_job_company: string;
}

export function parseFullName(fullName: string): ParsedName | null {
  if (!fullName || typeof fullName !== "string") return null;
  const parts = fullName.trim().split(/\s+/);
  if (parts.length !== 2) return null;
  const [first, last] = parts;
  return { first, last };
}

export function validateUploadPayload(
  payload: unknown
): ValidatedUploadPayload {
  if (!payload || typeof payload !== "object") {
    const err = new Error("Bad request: request body is required") as any;
    err.status = 400;
    throw err;
  }

  const data = payload as UploadResumePayload;
  const parsedName = parseFullName(data.name);

  if (
    !parsedName ||
    !data.current_job_title ||
    !data.current_job_description ||
    !data.current_job_company
  ) {
    const err = new Error("Bad request: invalid or missing fields") as any;
    err.status = 400;
    throw err;
  }

  return {
    parsedName,
    current_job_title: data.current_job_title,
    current_job_description: data.current_job_description,
    current_job_company: data.current_job_company,
  };
}

export function decodeSearchName(rawNameParam: string): ParsedName {
  let decoded = rawNameParam.replace(/\+/g, " ");

  //TODO: this is optional may be, check this again after making frontend
  try {
    decoded = decodeURIComponent(decoded);
  } catch (e) {
    // if decodeURIComponent fails, we have already the string with + replaced
  }

  const trimmed = decoded.trim();
  if (!trimmed) {
    const err = new Error("Bad request: name parameter is required") as any;
    err.status = 400;
    throw err;
  }

  const parts = trimmed.split(/\s+/);

  if (parts.length < 2) {
    const err = new Error("Bad request: need first and last name") as any;
    err.status = 400;
    throw err;
  }

  const first = parts[0];
  const last = parts.slice(1).join(" ");

  return { first, last };
}
