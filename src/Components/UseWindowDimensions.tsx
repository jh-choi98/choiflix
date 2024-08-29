import { useEffect, useState } from "react";

function getWindowDimensions() {
  const { innerWidth: width } = window;
  return width;
}
function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );
  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // useEffect훅의 cleanup 함수
    // 컴포넌트가 화면에서 사라질 때, 혹은 useEffect가 다시 실행될 때,
    // 메모리 누수를 방지(resize 이벤트 리스너 제거)하고 기존 useEffect 실행을 정리하기 위해
    // 이 함수가 사용됨
  }, []);
  return windowDimensions;
}

export default useWindowDimensions;
