import { Button, Input, Modal, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { axiosInstance } from "../services/axios";
import { setStreamId } from "../redux/slice";
import { useHistory } from "react-router-dom";
import { styled } from "styled-components";

const HomeContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 50px;
`;

const StreamsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const StreamItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 400px;
    border-bottom: 1px solid black;
    .stream-title {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
`;

function Home() {
const dispatch = useDispatch();
const history = useHistory();
const [loading, setLoading] = useState(false);
const [streams, setStreams] = useState([]); // [1]
  const [stream, setStream] = useState({
    title: "",
    description: "",
    username: "",
  });
  const [startStreamOpen, setStartStreamOpen] = useState(false);
  const { socket } = useSelector((state) => state.stream);

  const handleStartStream = async () => {
    if (!stream.title || !stream.description || !stream.username) return;
    try {
        const res = await axiosInstance.post("/broadcaster/start-stream", {
          ...stream,
        });
        dispatch(setStreamId(res.data.id));
        history.push("/stream");
    }
    catch (err) {
        console.log(err)
    }
  };

  useEffect(() => {
    setLoading(true);
    axiosInstance.get("/viewer/streams")
    .then((res) => {
        setStreams(res.data);
        setLoading(false);
    })
    .catch(err => {
        console.log(err)
        setLoading(false);
    })
  }, [])

  return (
    <>
      <HomeContainer>
        <Button onClick={() => setStartStreamOpen(true)} type="primary">
          Start Stream
        </Button>
        <StreamsList>
          {loading ? (
            <Spin />
          ) : (
            streams.map((stream) => (
              <StreamItem key={stream._id}>
                <div className="stream-title">
                  <span>{stream.title}</span>
                  <span>{stream.username}</span>
                </div>
                <Button onClick={() => history.push(`view-stream/${stream._id}`)}>
                  Watch Stream
                </Button>
              </StreamItem>
            ))
          )}
        </StreamsList>
      </HomeContainer>
      <Modal
        title="Start a stream"
        open={startStreamOpen}
        okText="Start Stream"
        onOk={handleStartStream}
        onCancel={() => setStartStreamOpen(false)}
      >
        <Input
          onChange={(e) =>
            setStream((prev) => ({
              ...prev,
              title: e.target.value,
            }))
          }
          placeholder="Stream Title"
        />
        <Input.TextArea
          onChange={(e) =>
            setStream((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
          placeholder="Stream Description"
        />
        <Input
          onChange={(e) =>
            setStream((prev) => ({
              ...prev,
              username: e.target.value,
            }))
          }
          placeholder="Username"
        />
      </Modal>
    </>
  );
}

export default Home;
