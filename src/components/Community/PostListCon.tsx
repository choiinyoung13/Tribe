import styled from "styled-components";
import PostCard from "./PostCard";
import loadingIcon from "../../assets/images/logo/ball-triangle.svg";
import {
  fetchPostsByKeyword,
  fetchPostsPerPage,
} from "../../config/api/post/fecthPosts";
import { useInfiniteQuery, useQuery } from "react-query";
import { PostType } from "../../types/PostType";
import { useInView } from "react-intersection-observer";
import { useEffect, useMemo } from "react";
import { communitySortState } from "../../recoil/atoms/SortState";
import { useRecoilValue } from "recoil";

export type FetchPostsResponse = {
  posts: PostType[];
  nextCursor: number | null;
};

interface PostListConProps {
  searchKeyword: string;
}

export default function PostListCon({ searchKeyword }: PostListConProps) {
  const sortValue = useRecoilValue(communitySortState);

  const { inView, ref } = useInView({
    threshold: 0.5,
    initialInView: true,
  });

  // 검색어가 있을 때는 검색어에 맞는 모든 데이터를 가져옴
  const { data: keywordData, isLoading: isKeywordLoading } = useQuery(
    ["posts", searchKeyword],
    () => fetchPostsByKeyword(searchKeyword),
    {
      staleTime: 10 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
      enabled: !!searchKeyword, // 검색어가 있을 때만 실행
    }
  );

  const {
    data: paginatedData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isPaginatedLoading,
  } = useInfiniteQuery<FetchPostsResponse>(
    ["posts"],
    ({ pageParam = 0 }) => fetchPostsPerPage(pageParam, 8),
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
      staleTime: 10 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
      enabled: !searchKeyword, // 검색어가 없을 때만 실행
    }
  );

  // 로딩 상태 처리
  const isLoading = isKeywordLoading || isPaginatedLoading;

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  // 데이터를 sortValue에 따라 재가공
  const sortedPosts = useMemo(() => {
    let allPosts: PostType[] = [];

    if (searchKeyword && keywordData) {
      // 검색어가 있을 때는 keywordData 사용
      allPosts = keywordData;
    } else if (paginatedData) {
      // 검색어가 없을 때는 기존 페이지네이션 데이터 사용
      allPosts = paginatedData.pages.flatMap((page) => page.posts);
    }

    // sortValue에 따라 정렬
    if (sortValue === "인기순") {
      return allPosts.sort(
        (a, b) => (b.liked?.length || 0) - (a.liked?.length || 0)
      );
    } else {
      return allPosts;
    }
  }, [keywordData, paginatedData, searchKeyword, sortValue]);

  if (isLoading) {
    return (
      <LoadingScreen>
        <img src={loadingIcon} alt="loading" />
      </LoadingScreen>
    );
  }

  if (!paginatedData || !sortedPosts) {
    return null;
  }

  return (
    <>
      <ListCon>
        <ListWrapper>
          {sortedPosts.length === 0 ? (
            <Empty>게시물이 없습니다.</Empty>
          ) : (
            <>
              {sortedPosts.map((post) => {
                return <PostCard key={post.id} post={post} />;
              })}
              {hasNextPage && <div ref={ref} />}
            </>
          )}
        </ListWrapper>
      </ListCon>
    </>
  );
}

const LoadingScreen = styled.div`
  width: 100%;
  height: 75vh;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 100px;
  }

  @media (max-width: 1024px) {
    img {
      width: 80px;
    }
  }

  @media (max-width: 768px) {
    img {
      width: 90px;
    }
  }

  @media (max-width: 600px) {
    img {
      width: 80px;
    }
  }
`;

const ListCon = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const ListWrapper = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
  flex-wrap: wrap;
`;

// const LoadingObserver = styled.div`
//   width: 100%;
//   height: 30px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
// `;

const Empty = styled.div`
  width: 100%;
  height: calc(100vh - 220px);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;

  @media (max-width: 1024px) {
    font-size: 1.4rem;
  }
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
  @media (max-width: 600px) {
    font-size: 1.2rem;
  }
`;
