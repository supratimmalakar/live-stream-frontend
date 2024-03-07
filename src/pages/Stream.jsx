import React, { useEffect, useState, useRef } from "react";
import { styled } from "styled-components";
import { axiosInstance } from "../services/axios";
import { useSelector } from "react-redux";
import {useHistory} from 'react-router-dom';

const StreamContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 50px;
`

const Video = styled.video`
    width: 500px;
    height: 300px;
`

function Stream() {
    const history = useHistory();
  const [stream, setStream] = useState(null);
  const {streamId} = useSelector(state => state.stream)
  const videoRef = React.useRef();
  async function init() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(stream);
        videoRef.current.srcObject = stream;
        const peer = createPeer();
        stream.getTracks().forEach((track) => peer.addTrack(track, stream));
    }
    catch(err) {
        console.log(err)
    }
  }

  function createPeer() {
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.stunprotocol.org",
        },
      ],
    });
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);

    return peer;
  }

  async function handleNegotiationNeededEvent(peer) {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    const payload = {
      sdp: peer.localDescription,
      streamId,
    };

    const { data } = await axiosInstance.post("/broadcaster/handshake", payload);
    const desc = new RTCSessionDescription(data.sdp);
    peer.setRemoteDescription(desc).catch((e) => console.log(e));
  }

  useEffect(() => {
    if (!streamId) {
        history.push('/')
        return;
    }
    init();
  }, []);

  return (
    <StreamContainer>
      <span>Stream</span>
      {stream && <Video autoPlay muted ref={videoRef}></Video>}
    </StreamContainer>
  );
}

export default Stream;
