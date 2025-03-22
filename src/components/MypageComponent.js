import React, { useState, useEffect } from "react";

const MyPageComponent = () => {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        // 로컬 스토리지에서 'user' 키로 저장된 데이터 가져오기
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            // 가져온 데이터를 JSON으로 파싱해서 상태에 저장
            setUserInfo(JSON.parse(storedUser));
        }
    }, []);

    if (!userInfo) {
        // userInfo가 없으면 로딩 중 표시 또는 기본 메시지
        return <div>로딩 중...</div>;
    }

    return (
            <div className="relative w-full h-auto bg-white rounded-[10px] shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4">마이페이지</h2>
                <div>
                    <br/><p><strong>이메일:</strong> {userInfo.email}</p><br/>
                    <p><strong>이름:</strong> {userInfo.name}</p><br/>
                    <p><strong>성별:</strong> {userInfo.gender}</p><br/>
                    <p><strong>생년월일:</strong> {userInfo.birth}</p><br/>
                    <p><strong>알레르기:</strong> {userInfo.allergies.join(", ")}</p><br/>
                    <p><strong>건강 목표:</strong> {userInfo.health_goal}</p><br/>
                </div>
            </div>
            );
            };

            export default MyPageComponent;
