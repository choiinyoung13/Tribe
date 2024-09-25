import styled from "styled-components";
import profile1 from "../../assets/images/community/fake_profile/1.jpg";
import profile2 from "../../assets/images/community/fake_profile/2.jpg";
import profile3 from "../../assets/images/community/fake_profile/3.jpg";
import { FaPlus } from "react-icons/fa";

export default function FollowRecommends() {
  return (
    <>
      <FollowRecommend>
        <FollowRecommendLeft>
          <Profile src={profile1} />
          <TextSection>
            <UserName>dlsdud156</UserName>
            <Description>풀과 달, 식물과 제철 그리고 고양이</Description>
          </TextSection>
        </FollowRecommendLeft>
        <FollowRecommendRight>
          <FaPlus />
        </FollowRecommendRight>
      </FollowRecommend>
      <FollowRecommend>
        <FollowRecommendLeft>
          <Profile src={profile2} />
          <TextSection>
            <UserName>chldls153</UserName>
            <Description>풀과 달, 식물과 제철 그리고 고양이</Description>
          </TextSection>
        </FollowRecommendLeft>
        <FollowRecommendRight>
          <FaPlus />
        </FollowRecommendRight>
      </FollowRecommend>
      <FollowRecommend>
        <FollowRecommendLeft>
          <Profile src={profile3} />
          <TextSection>
            <UserName>alscjf448</UserName>
            <Description>풀과 달, 식물과 제철 그리고 고양이</Description>
          </TextSection>
        </FollowRecommendLeft>
        <FollowRecommendRight>
          <FaPlus />
        </FollowRecommendRight>
      </FollowRecommend>
      <FollowRecommend>
        <FollowRecommendLeft>
          <Profile src={profile1} />
          <TextSection>
            <UserName>dlsdud156</UserName>
            <Description>풀과 달, 식물과 제철 그리고 고양이</Description>
          </TextSection>
        </FollowRecommendLeft>
        <FollowRecommendRight>
          <FaPlus />
        </FollowRecommendRight>
      </FollowRecommend>
    </>
  );
}

const FollowRecommend = styled.div`
  margin-top: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(240, 240, 240, 1);
  }

  &:first-of-type {
    margin-top: 0px;
  }
`;
const Profile = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1px soild rgba(240, 240, 240, 1);
`;
const TextSection = styled.div`
  width: 140px;
  margin-left: 8px;
`;
const UserName = styled.div`
  font-size: 0.85rem;
  font-weight: bold;
  color: rgba(30, 30, 30, 1);
`;
const Description = styled.div`
  font-size: 0.75rem;
  font-weight: thin;
  margin-top: 6px;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FollowRecommendLeft = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;
const FollowRecommendRight = styled.div`
  svg {
    margin-right: 4px;
    font-size: 1.2rem;
    color: rgba(50, 50, 50, 1);
    cursor: pointer;

    &:hover {
      color: rgba(100, 100, 100, 1);
    }
  }
`;
