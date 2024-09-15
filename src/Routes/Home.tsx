import { useQuery } from "react-query";
import {
  getLatest,
  getMovies,
  getTopRated,
  getUpComing,
  IGetMovies,
} from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence } from "framer-motion";
import { useHistory, useRouteMatch } from "react-router-dom";
import Slider from "../Components/Slider";

const OFFSET = 6;

const Wrapper = styled.div`
  background-color: black;
  height: 100vh;
  width: 100vw;
  overflow-y: scroll;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 70vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.9)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 60px;
  margin-bottom: 30px;
`;

const Overview = styled.p`
  font-size: 24px;
  width: 50%;
`;

// const Slider = styled.div`
//   position: relative;
//   top: -100px;
//   width: 100vw;
// `;

// const Row = styled(motion.div)`
//   display: grid;
//   gap: ${GAP}px;
//   grid-template-columns: repeat(6, 1fr);
//   margin-bottom: 5px;
//   position: absolute;
//   width: 100%;
// `;

// const Box = styled(motion.div)<{ bgPhoto: string }>`
//   background-color: white;
//   background-image: url(${(props) => props.bgPhoto});
//   background-size: cover;
//   background-position: center;
//   height: 200px;
//   font-size: 64px;
//   cursor: pointer;
//   &:first-child {
//     transform-origin: center left;
//   }
//   &:last-child {
//     transform-origin: center right;
//   }
// `;

// const Detail = styled(motion.div)`
//   padding: 10px;
//   background-color: ${(props) => props.theme.black.lighter};
//   opacity: 0;
//   position: absolute;
//   width: 100%;
//   bottom: 0;
//   h4 {
//     text-align: center;
//     font-size: 16px;
//   }
// `;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const SelectedMovie = styled(motion.div)`
  position: fixed;
  width: 40vw;
  height: 60vh;
  top: 50px;
  left: 0;
  right: 0;
  margin: 0% auto;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;
`;

const SelectedMovieCover = styled.div`
  width: 100%;
  height: 50%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const SelectedMovieTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 10px;
  text-align: center;
  font-size: 25px;
  position: relative;
  top: -55px;
`;

const SelectedMovieOverview = styled.p`
  padding: 0px 15px;
  color: ${(props) => props.theme.white.lighter};
  position: absolute;
  top: 415px;
`;

// const boxVariants = {
//   normal: {
//     scale: 1,
//   },
//   hover: {
//     scale: 1.3,
//     y: -50,
//     transition: {
//       delay: 0.5,
//       duration: 0.3,
//       transition: { type: "tween" },
//     },
//   },
// };

// const detailVariants = {
//   hover: {
//     opacity: 1,
//     transition: {
//       delay: 0.5,
//       duration: 0.3,
//       transition: { type: "tween" },
//     },
//   },
// };

function Home() {
  const history = useHistory();
  const selectedMovieMatch = useRouteMatch<{ movieId: string }>(
    "/movies/:movieId"
  );

  // const { data, isLoading } = useQuery<IGetMovies>(
  //   ["movies", "now_playing"],
  //   getMovies
  // );

  const useMultipleQuery = () => {
    const latest = useQuery(["latest"], getLatest);
    const topRated = useQuery(["topRated"], getTopRated);
    const upComing = useQuery(["upComing"], getUpComing);
    return [latest, topRated, upComing];
  };

  const [
    { isLoading: loadingLatest, data: latestData },
    { isLoading: loadingTopRated, data: topRatedData },
    { isLoading: loadingUpComing, data: upcomingData },
  ] = useMultipleQuery();

  // const movieCategories = [
  //   { id: 1, title: "Top Rated Movies", data: topRatedData },
  //   { id: 2, title: "Latest Movies", data: latestData },
  //   { id: 3, title: "Upcoming Movies", data: upcomingData },
  // ];

  let isLoading = loadingLatest && loadingTopRated && loadingUpComing;

  // const [leaving, setLeaving] = useState(false);
  // const increaseIndex = () => {
  //   if (data) {
  //     if (leaving) return;
  //     setLeaving(true);
  //     const totalMovies = data?.results.length - 1;
  //     const maxIndex = Math.floor(totalMovies / OFFSET) - 1;
  //     setIndex((prev) => (prev < maxIndex ? (prev += 1) : 0));
  //   }
  // };
  // const onBoxClicked = (movieId: number) => {
  //   history.push(`/movies/${movieId}`);
  // };
  const onOverlayClick = () => {
    history.push("/");
  };
  // const selectedMovieInfo =
  //   selectedMovieMatch?.params.movieId &&
  //   data?.results.find(
  //     (movie) => String(movie.id) === selectedMovieMatch?.params.movieId
  //   );
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(
              topRatedData?.results[0].backdrop_path || ""
            )}>
            <Title>{topRatedData?.results[0].title}</Title>
            <Overview>{topRatedData?.results[0].overview}</Overview>
          </Banner>
          {/* <Slider>
            <AnimatePresence
              initial={false}
              onExitComplete={() => setLeaving(false)}>
              <Row
                initial={{ x: width + GAP }}
                animate={{ x: 0 }}
                exit={{ x: -width - GAP }}
                transition={{ type: "tween", duration: 1 }}
                key={index}
                // react는 key가 바뀌면 기존의 컴포넌트가 사라졌다고 판단
              >
                {data?.results
                  .slice(1)
                  .slice(OFFSET * index, OFFSET * index + OFFSET)
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
            </AnimatePresence>
          </Slider> */}
          <Slider title={"Top Rated"} data={topRatedData} offset={OFFSET} />
          <Slider title={"Latest"} data={latestData} offset={OFFSET} />
          <Slider title={"Upcoming"} data={upcomingData} offset={OFFSET} />

          {/* <AnimatePresence>
            {selectedMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <SelectedMovie layoutId={selectedMovieMatch.params.movieId}>
                  {selectedMovieInfo && (
                    <>
                      <SelectedMovieCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent),  url(${makeImagePath(
                            selectedMovieInfo.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <SelectedMovieTitle>
                        {selectedMovieInfo.title}
                      </SelectedMovieTitle>
                      <SelectedMovieOverview>
                        {selectedMovieInfo.overview}
                      </SelectedMovieOverview>
                    </>
                  )}
                </SelectedMovie>
              </>
            ) : null}
          </AnimatePresence> */}
        </>
      )}
    </Wrapper>
  );
}

export default Home;
