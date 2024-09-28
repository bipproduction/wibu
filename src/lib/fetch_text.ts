export async function fetchFileContent(
  repo: string,
  filePath: string
): Promise<string> {
  const response = await fetch(
    `https://raw.githubusercontent.com/bipproduction/${repo}/main/${filePath}`
  );
  return response.text();
}
