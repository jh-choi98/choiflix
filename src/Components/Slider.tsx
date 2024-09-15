import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import useWindowDimensions from "./UseWindowDimensions";
import { useState } from "react";
import { makeImagePath } from "../utils";
import { useHistory } from "react-router-dom";
import { IGetMovies } from "../api";

const GAP = 5;

const Wrapper = styled.div`
  width: 100vw;
  position: relative;
  margin-bottom: 30px;
`;

const Title = styled.h1``;

const Row = styled(motion.div)`
  display: grid;
  gap: ${GAP}px;
  grid-template-columns: repeat(6, 1fr);
  margin-bottom: 5px;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center;
  height: 200px;
  font-size: 64px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Detail = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 16px;
  }
`;

const Button = styled.button`
  border: none;
  background-color: ${(props) => props.theme.black.darkest};
  color: ${(props) => props.theme.white.lighter};
  position: absolute;
  top: 16px;
  right: 0px;
  font-size: 30px;
  padding: 5px;
  padding-left: 10px;
  height: 200px;
  opacity: 0.8;
  &:hover {
    opacity: 1;
  }
`;

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.3,
      transition: { type: "tween" },
    },
  },
};

const detailVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      transition: { type: "tween" },
    },
  },
};

interface ISlider {
  title: string;
  data: IGetMovies;
  offset: number;
}

function Slider({ title, data, offset }: ISlider) {
  const history = useHistory();
  const width = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const increaseIndex = (e: React.MouseEvent<HTMLButtonElement>) => {
    // console.log(e.)
    if (data) {
      if (leaving) return;
      setLeaving(true);
      const totalMovies = data?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev < maxIndex ? (prev += 1) : 0));
    }
  };
  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };
  return data.results ? (
    <Wrapper>
      <Title>{title}</Title>
      <AnimatePresence initial={false} onExitComplete={() => setLeaving(false)}>
        <Row
          initial={{ x: width + GAP }}
          animate={{ x: 0 }}
          exit={{ x: -width - GAP }}
          transition={{ type: "tween", duration: 1 }}
          key={index}
          // react는 key가 바뀌면 기존의 컴포넌트가 사라졌다고 판단
        >
          {(data?.results || [])
            .slice(offset * index, offset * index + offset)
            .map((movie) => (
              <Box
                layoutId={movie.id + ""}
                variants={boxVariants}
                key={movie.id}
                initial="normal"
                whileHover="hover"
                transition={{ type: "tween" }}
                onClick={() => onBoxClicked(movie.id)}
                bgPhoto={makeImagePath(movie.backdrop_path, "w500")}>
                <Detail variants={detailVariants}>
                  <h4>{movie.title}</h4>
                </Detail>
              </Box>
            ))}
        </Row>
        <Button onClick={increaseIndex}>▶</Button>
      </AnimatePresence>
    </Wrapper>
  ) : null;
}

export default Slider;
