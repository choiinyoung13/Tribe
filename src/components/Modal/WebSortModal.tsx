import { useRef } from 'react'
import { useRecoilState } from 'recoil'
import styled from 'styled-components'
import { shopSortState } from '../../recoil/atoms/SortState'

interface WebSortModalProps {
  className?: string
  setSortModalOpenedState: React.Dispatch<React.SetStateAction<boolean>>
}

export default function WebSortModal({
  className,
  setSortModalOpenedState,
}: WebSortModalProps) {
  const [sortDataState, setSortDataState] = useRecoilState(shopSortState)

  const sortDatas = useRef(['추천순', '낮은가격순', '높은가격순', '할인률순'])

  return (
    <>
      <ModalCon
        className={className}
        onClick={e => {
          e.stopPropagation()
        }}
      >
        {sortDatas.current.map((data: string, i: number) => {
          const isActive = sortDataState === data
          return (
            <ModalText
              key={i}
              className={isActive ? 'active' : ''}
              onClick={() => {
                setSortDataState(data)
                setSortModalOpenedState(prev => !prev)
              }}
            >
              {data}
            </ModalText>
          )
        })}
      </ModalCon>
    </>
  )
}

const ModalCon = styled.div`
  box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
  background-color: #fff;
  border-radius: 10px;
  width: 130px;

  @media (max-width: 600px) {
    width: 103px;
  }
`

const ModalText = styled.div`
  padding: 14px 12px;
  font-size: 0.9rem;
  font-weight: 400;
  color: rgba(110, 110, 110, 1);
  cursor: pointer;

  &:hover {
    background-color: rgba(240, 240, 240, 1);
  }

  &.active {
    position: relative;
    font-weight: 500;
    color: rgba(20, 20, 20, 1);

    &::after {
      position: absolute;
      right: 20px;
      top: 15px;
      content: '';
      transform: rotate(45deg);
      width: 6px;
      height: 11px;
      border-right: 1px solid black;
      border-bottom: 1px solid black;
    }
  }

  @media (max-width: 600px) {
    font-size: 0.8rem;

    &.active {
      &::after {
        position: absolute;
        right: 16px;
        top: 13px;
        content: '';
        transform: rotate(45deg);
        width: 5px;
        height: 9px;
        border-right: 1px solid black;
        border-bottom: 1px solid black;
      }
    }
  }
`
