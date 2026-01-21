import { mapNetworkErrorMessage } from "./network-error";
import { getErrorText } from "./getError";
/**
 * Fetches ICE servers from the backend.
 */
export async function fetchIceServers(): Promise<RTCConfiguration> {
  let res: Response;

  // ---- Catch Errors ----
  try {
    res = await fetch(`${process.env.EXPO_PUBLIC_API_BASE}/ice-servers`);
  }catch (err: any){
  const friendly = mapNetworkErrorMessage(getErrorText(err));
    const error = new Error(friendly);
    (error as { cause?: unknown }).cause = err;
    throw error;
  }
  // GUARD
  if (!res.ok) {

    let bodyText: string | undefined;
    try {
      bodyText = await res.text();
    } catch {
      // Ignore!
    }

    const friendly = mapNetworkErrorMessage(
      bodyText || res.statusText ||
      `HTTP ${res.status}`, res.status
    );

    const error = new Error(friendly);
    (error as { cause?: unknown }).cause = {
      status: res.status,
      statusText: res.statusText,
      body: bodyText,
    };
    throw error;
  }
// --------
  const data = await res.json();

  return {
    iceServers: data.iceServers.map((s: any) => {
      const server: any = { urls: s.urls };
      if (s.username && s.credential) {
        server.username = s.username;
        server.credential = s.credential;
      }
      return server;
    }),
  };
}
