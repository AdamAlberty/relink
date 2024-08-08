export async function verifyConnection() {
  const res = await fetch(`${localStorage.getItem("serverURL")}/api/verify`, {
    method: "POST",
    headers: {
      Authorization: localStorage.getItem("apiKey")!,
    },
  });
  return res;
}

export async function getShortlinks() {
  const res = await fetch(`${localStorage.getItem("serverURL")}/api/links`, {
    method: "GET",
    headers: {
      Authorization: localStorage.getItem("apiKey")!,
    },
  });
  if (res.ok) {
    return await res.json();
  }
  throw new Error("Could not load links");
}

export async function importShortlinks(formData: FormData) {
  const res = await fetch(`${localStorage.getItem("serverURL")}/api/import`, {
    method: "POST",
    headers: {
      Authorization: localStorage.getItem("apiKey")!,
    },
    body: formData,
  });
  if (res.ok) {
    return await res.json();
  }
  throw new Error("Could not load links");
}

export async function exportShortlinks() {
  const res = await fetch(`${localStorage.getItem("serverURL")}/api/export`, {
    method: "POST",
    headers: {
      Authorization: localStorage.getItem("apiKey")!,
    },
  });
  if (res.ok) {
    const url = window.URL.createObjectURL(await res.blob());
    const a = document.createElement("a");
    a.href = url;
    a.download = "shortlinks_export.csv";
    document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
    a.click();
    a.remove();
  } else {
    throw new Error("Could not export links");
  }
}

export async function createShortlink(payload: {
  short: string;
  long: string;
}) {
  const res = await fetch(`${localStorage.getItem("serverURL")}/api/links`, {
    method: "POST",
    headers: {
      Authorization: localStorage.getItem("apiKey")!,
    },
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    return res;
  }
  throw new Error("could not create shortlink");
}
