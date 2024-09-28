type WAPinHandler = {
  status: string;
  id?: string | null;
};
export async function waPinHandler({
  nom,
  text
}: {
  nom: number;
  text: string;
}): Promise<WAPinHandler> {
  const res = await fetch(
    `https://wa.wibudev.com/code?nom=${nom}&text=${text}`
  );

  if (!res.ok) {
    console.error("Error:", res.statusText);
    const result: WAPinHandler = {
      status: "error",
      id: ""
    };

    return result;
  }

  try {
    const data = (await res.json()) as WAPinHandler;
    return data;
  } catch (error) {
    console.error("Error:", error);
    return {
      status: "error"
    } as WAPinHandler;
  }
}
