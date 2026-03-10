import { useEffect, useState, useCallback } from "react";

export function useBroadcast(channelName = "mamahub_events") {
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [channel, setChannel] = useState<BroadcastChannel | null>(null);

  useEffect(() => {
    const bc = new BroadcastChannel(channelName);
    setChannel(bc);

    bc.onmessage = (event) => {
      setLastMessage(event.data);
    };

    return () => {
      bc.close();
    };
  }, [channelName]);

  const postMessage = useCallback(
    (message: any) => {
      if (channel) {
        channel.postMessage(message);
      }
    },
    [channel],
  );

  return { lastMessage, postMessage };
}
