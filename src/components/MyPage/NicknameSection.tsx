import styled from 'styled-components'
import Swal from 'sweetalert2'
import { changeNickname } from '../../config/api/user/ChangeNickname'
import { useEffect, useState } from 'react'
import { nicknameRegex } from '../../utill/checkInputValueValid'

interface NicknameSectionProps {
  userInfo: any
  isNicknameEditMode: boolean
  setIsNicknameEditMode: (value: boolean) => void
  setUserInfo: (userInfo: any) => void
}

export function NicknameSection({
  userInfo,
  isNicknameEditMode,
  setIsNicknameEditMode,
  setUserInfo,
}: NicknameSectionProps) {
  const [initialNickname, setInitialNickname] = useState<string>('')
  const [inputValue, setInputValue] = useState<string>('')

  useEffect(() => {
    if (!userInfo) return

    if (!userInfo.nickname) {
      setInitialNickname(userInfo.email.split('@')[0])
      setInputValue(userInfo.email.split('@')[0])
    } else {
      setInitialNickname(userInfo.nickname)
      setInputValue(userInfo.nickname)
    }
  }, [userInfo])

  // 닉네임 저장 로직
  const onSave = async (newNickname: string, id: string) => {
    if (!initialNickname) return

    // 닉네임 유효성 검사
    if (!nicknameRegex.test(inputValue)) {
      Swal.fire({
        text: '유효하지 않은 닉네임 형식입니다.',
        icon: 'warning',
        confirmButtonColor: '#1E1E1E',
        confirmButtonText: '확인',
        scrollbarPadding: false,
      })
      return
    }

    // 기존 닉네임과 같으면 경고창을 띄움
    if (initialNickname === inputValue) {
      Swal.fire({
        text: '현재 사용중인 닉네임입니다.',
        icon: 'warning',
        confirmButtonColor: '#1E1E1E',
        confirmButtonText: '확인',
        scrollbarPadding: false,
      })
      return
    }

    const result = await changeNickname(newNickname, id)

    // 닉네임 변경이 성공하면 상태 업데이트
    if (result.success) {
      setUserInfo((prev: any) => ({
        ...prev,
        nickname: newNickname,
      }))
      setIsNicknameEditMode(false)

      Swal.fire({
        text: '닉네임이 성공적으로 변경되었습니다.',
        icon: 'success',
        confirmButtonColor: '#1E1E1E',
        confirmButtonText: '확인',
        scrollbarPadding: false,
      })
    }
  }

  return (
    <Section>
      <SectionHeader>
        <Title>닉네임</Title>
        <ButtonWrapper>
          {!isNicknameEditMode && (
            <button onClick={() => setIsNicknameEditMode(true)}>수정</button>
          )}
          {isNicknameEditMode && (
            <EditButtonWrapper>
              <button
                onClick={() => {
                  onSave(inputValue, userInfo.id) // 닉네임 저장 호출
                }}
              >
                저장
              </button>
              <button
                onClick={() => {
                  setInputValue(initialNickname) // 원래 닉네임으로 복구
                  setIsNicknameEditMode(false)
                }}
              >
                취소
              </button>
            </EditButtonWrapper>
          )}
        </ButtonWrapper>
      </SectionHeader>
      <SectionBody>
        <input
          draggable={false}
          disabled={!isNicknameEditMode}
          type="text"
          value={inputValue}
          onChange={e => {
            if (isNicknameEditMode) {
              setInputValue(e.target.value)
            }
          }}
          style={{ pointerEvents: isNicknameEditMode ? 'auto' : 'none' }}
        />
        <Infomation>
          * 닉네임은 변경 후 30일이 지나야 다시 바꿀 수 있습니다. <br />*
          한글/영문/숫자만 사용할 수 있으며, 특수문자는 사용할 수 없습니다.{' '}
          <br />
        </Infomation>
      </SectionBody>
    </Section>
  )
}

// 스타일링
const Section = styled.section`
  width: 100%;
`

const SectionHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;

  button {
    background-color: rgba(0, 0, 0, 0);
    border: none;
    cursor: pointer;
    font-size: 1rem;
    color: rgb(0, 109, 235);
  }
`

const SectionBody = styled.div`
  input {
    width: 100%;
    padding: 10px;
    font-size: 1rem;
    background-color: rgb(245, 245, 245);
    border: 1px solid rgba(230, 230, 230, 1);
    border-radius: 6px;

    &:focus {
      outline: 2px solid rgba(30, 30, 30, 1);
    }

    &:disabled {
      color: rgba(150, 150, 150, 1);
    }
  }

  @media (max-width: 768px) {
    input {
      font-size: 0.85rem;
    }
  }
`

const Infomation = styled.p`
  line-height: 28px;
  margin-top: 10px;
  color: rgba(120, 120, 120, 1);
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`

const Title = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: rgba(50, 50, 50, 1);

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`

const ButtonWrapper = styled.div``

const EditButtonWrapper = styled.div``
