"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { DataConnection, Peer as PeerType } from "peerjs";

export type P2PStatus = "idle" | "waiting" | "connected" | "error";

type UseP2PGameOptions = {
  enabled: boolean;
  onRemoteMove: (msg: string) => void;
};

export type UseP2PGameReturn = {
  peerId: string | null;
  status: P2PStatus;
  connect: (remoteId: string) => void;
  sendMove: (msg: string) => void;
  disconnect: () => void;
};

export function useP2PGame({ enabled, onRemoteMove }: UseP2PGameOptions): UseP2PGameReturn {
  const [peerId, setPeerId] = useState<string | null>(null);
  const [status, setStatus] = useState<P2PStatus>("idle");

  const peerRef = useRef<PeerType | null>(null);
  const connRef = useRef<DataConnection | null>(null);
  // Keep callback ref so setupConnection closure never goes stale
  const onRemoteMoveRef = useRef(onRemoteMove);
  useEffect(() => { onRemoteMoveRef.current = onRemoteMove; }, [onRemoteMove]);

  const setupConnection = useCallback((conn: DataConnection) => {
    connRef.current = conn;
    conn.on("open", () => setStatus("connected"));
    conn.on("data", (data) => {
      if (typeof data === "string") onRemoteMoveRef.current(data);
    });
    conn.on("close", () => {
      connRef.current = null;
      setStatus("waiting");
    });
    conn.on("error", () => setStatus("error"));
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let peer: PeerType;

    import("peerjs").then(({ default: Peer }) => {
      peer = new Peer();
      peerRef.current = peer;

      peer.on("open", (id) => {
        setPeerId(id);
        setStatus("waiting");
      });
      peer.on("connection", (conn) => setupConnection(conn));
      peer.on("error", () => setStatus("error"));
    });

    return () => {
      peer?.destroy();
      peerRef.current = null;
      connRef.current = null;
    };
  }, [enabled, setupConnection]);

  const connect = useCallback((remoteId: string) => {
    if (!peerRef.current) return;
    const conn = peerRef.current.connect(remoteId);
    setupConnection(conn);
  }, [setupConnection]);

  const sendMove = useCallback((msg: string) => {
    connRef.current?.send(msg);
  }, []);

  const disconnect = useCallback(() => {
    connRef.current?.close();
    connRef.current = null;
    setStatus("waiting");
  }, []);

  return { peerId, status, connect, sendMove, disconnect };
}
