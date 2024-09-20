import styled from "styled-components";
import { IoSearch } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import PostListCon from "../components/Community/PostListCon";
import RealTimeKeywords from "../components/Community/RealTimeKeywords";
import FollowRecommends from "../components/Community/FollowRecommends";
import SortButton from "../components/Community/SortButton";
import useWindowWidth from "../hooks/useWindowWidth";
import { useState } from "react";
import PostModal from "../components/Community/PostModal"; // PostModal 컴포넌트 추가

export default function Community() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tab = searchParams.get("tab");
  const windowWidth = useWindowWidth();

  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [
    { id: 1, title: "전체", count: 321 },
    { id: 2, title: "잡담", count: 54 },
    { id: 3, title: "이벤트", count: 101 },
    { id: 4, title: "질문", count: 108 },
    { id: 5, title: "나눔", count: 60 },
    { id: 6, title: "정보", count: 91 },
    { id: 7, title: "기타", count: 12 },
  ];

  // 모달 열기 함수
  const openModal = () => {
    setIsModalOpen(true);
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <CommunityCon>
      {windowWidth >= 768 ? (
        <Sidebar>
          {categories.map((cat) => {
            return (
              <Link
                to={
                  cat.title === "전체"
                    ? "/community"
                    : `/community?tab=${cat.id - 1}`
                }
                key={cat.id}
              >
                <NavItem isActive={Number(tab) === cat.id - 1}>
                  {cat.title}({cat.count})
                </NavItem>
              </Link>
            );
          })}
        </Sidebar>
      ) : (
        <SelectSection>
          <Select>
            {categories.map((category) => {
              return (
                <option>
                  {category.title}
                  {`(${category.count})`}
                </option>
              );
            })}
          </Select>
        </SelectSection>
      )}
      <MainContent>
        <MainContentHeader>
          <HeaderLeft>
            <InputWrapper>
              <SearchIcon>
                <IoSearch />
              </SearchIcon>
              <Input placeholder="궁금한 키워드 입력" />
            </InputWrapper>
          </HeaderLeft>
          <HeaderRight>
            <SortButton />
            <PostButton onClick={openModal}>글쓰기</PostButton>{" "}
            {/* 모달 열기 */}
          </HeaderRight>
        </MainContentHeader>
        <Feed>
          <PostListCon />
        </Feed>
      </MainContent>
      <RightSidebar>
        <WidgetWrapper>
          <WidgetTitle>실시간 인기 키워드</WidgetTitle>
          <WidgetBack>
            <Widget>
              <RealTimeKeywords />
            </Widget>
          </WidgetBack>
        </WidgetWrapper>
        <WidgetWrapper>
          <WidgetTitle>이웃 추천</WidgetTitle>
          <WidgetBack>
            <Widget>
              <FollowRecommends />
            </Widget>
          </WidgetBack>
        </WidgetWrapper>
      </RightSidebar>
      {/* 글쓰기 모달 */}
      {isModalOpen && <PostModal onClose={closeModal} />} {/* 모달 컴포넌트 */}
    </CommunityCon>
  );
}

// 전체 레이아웃 컨테이너
const CommunityCon = styled.div`
  display: flex;
  width: 100%;
  margin-top: 100px;
  overflow: visible;

  box-shadow: inset 1px 1px 5px rgba(0, 0, 0, 0.1);

  background-color: #fff;

  @media (max-width: 1024px) {
    margin-top: 90px;
  }

  @media (max-width: 768px) {
    margin-top: 74px;
    flex-direction: column;
  }

  @media (max-width: 600px) {
    margin-top: 52px;
    flex-direction: column;
  }
`;

// 왼쪽 사이드바
const Sidebar = styled.div`
  position: sticky;
  top: 0px;
  width: 200px;
  padding: 30px;
  background-color: #ffffff;
  border-right: 1px solid #e1e1e1;
  box-shadow: inset 1px 1px 5px rgba(0, 0, 0, 0.1);
  height: 100vh;

  @media (max-width: 768px) {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e1e1e1;
  }
`;

const SelectSection = styled.div`
  position: relative;
  width: 100%;
  padding: 20px 20px 0 20px;
  background-color: #f4f4f4;

  &::after {
    content: "";
    position: absolute;
    top: 65%;
    right: 32px;
    transform: translateY(-50%);
    border: solid transparent;
    border-width: 6px 6px 0;
    border-top-color: #000;
    pointer-events: none;
  }

  @media (max-width: 600px) {
    padding: 30px 20px 0 20px;

    &::after {
      content: "";
      position: absolute;
      top: 72%;
      right: 32px;
      transform: translateY(-50%);
      border: solid transparent;
      border-width: 6px 6px 0;
      border-top-color: #000;
      pointer-events: none;
    }
  }
`;

const Select = styled.select`
  width: 100%;
  background-color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px 10px 10px;
  appearance: none;

  &:focus {
    outline: none;
  }
`;

interface NavItemProps {
  isActive: boolean;
}

const NavItem = styled.div<NavItemProps>`
  margin: 30px 0;
  font-size: 1rem;
  color: ${(props) =>
    props.isActive ? "rgba(60, 60, 60, 1)" : "rgba(130, 130, 130, 1)"};
  cursor: pointer;
  font-weight: ${(props) => (props.isActive ? "bold" : "normal")};

  &:hover {
    color: rgba(60, 60, 60, 1);
    font-weight: bold;
  }

  &:nth-child(1) {
    margin-top: 0;
  }

  @media (max-width: 768px) {
    margin: 10px 0;
    font-size: 1rem;
  }
`;

// 중앙 메인 컨텐츠 영역
const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #f4f4f4;
  width: 100%;
  height: fit-content;
  min-height: 100vh;
  @media (max-width: 768px) {
    padding: 14px 20px 20px 20px;
  }
`;

const MainContentHeader = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  flex: 8;
  margin-right: 20px;

  @media (max-width: 768px) {
    margin-right: 12px;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  flex: 1;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const SearchIcon = styled.div`
  font-size: 1rem;
  color: rgba(150, 150, 150, 1);
  position: absolute;
  top: 50%;
  transform: translateY(-45%);
  left: 13px;
`;

const Input = styled.input`
  width: 100%;
  background-color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 14px 10px 36px;
  font-size: 0.9rem;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: rgba(150, 150, 150, 1);
  }
`;

const PostButton = styled.button`
  width: 70px;
  padding: 6px 10px;
  background-color: #141414;
  font-size: 0.85rem;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 16px;

  &:hover {
    background-color: #242424;
  }

  @media (max-width: 1919px) {
    margin-left: 26px;
  }

  @media (max-width: 768px) {
    margin-left: 12px;
  }
`;

// 게시글 피드
const Feed = styled.div`
  margin-top: 20px;
  width: 100%;
  height: 100%;
`;

// 오른쪽 사이드바
const RightSidebar = styled.div`
  position: sticky;
  top: 0px;
  width: 350px;
  padding: 30px 22px;
  background-color: #ffffff;
  border-left: 1px solid #e1e1e1;
  box-shadow: inset 1px 1px 5px rgba(0, 0, 0, 0.1);
  height: 100vh;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const WidgetWrapper = styled.div`
  margin-bottom: 40px;
`;

const WidgetBack = styled.div`
  background-color: #f4f4f4;
  padding: 17px;
  border-radius: 6px;
`;

const WidgetTitle = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 16px;
  margin-left: 4px;
`;

const Widget = styled.div``;
