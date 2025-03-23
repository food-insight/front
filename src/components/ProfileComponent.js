import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api/userApi";
import { getCookie } from "../util/cookieUtil";

function ProfileComponent() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [newAllergy, setNewAllergy] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const token = getCookie("accessToken").replace("Bearer ", "");

  useEffect(() => {
    async function fetchProfile() {
      const data = await getProfile(token);
      setProfile(data);
      setFormData({ ...data });
    }
    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAllergy = () => {
    if (!newAllergy.trim()) return;
    setFormData((prev) => ({
      ...prev,
      allergies: [...(prev.allergies || []), newAllergy.trim()]
    }));
    setNewAllergy("");
  };

  const handleRemoveAllergy = (name) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((a) => a !== name)
    }));
  };

  const handleSave = async () => {
    try {
      const updated = await updateProfile(token, formData);
      setProfile(updated.user);
      setIsEditing(false);
      alert("프로필이 저장되었습니다.");
    } catch (error) {
      alert("저장 실패: " + error.message);
    }
  };

  if (!profile) return <p>로딩 중...</p>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">내 프로필</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">이메일</label>
          <input
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">이름</label>
          <input
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">성별</label>
          <select
            name="gender"
            value={formData.gender || ""}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full p-2 border rounded"
          >
            <option value="">선택</option>
            <option value="male">남성</option>
            <option value="female">여성</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">생년월일</label>
          <input
            name="birth"
            type="date"
            value={formData.birth || ""}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">건강 목표</label>
          <input
            name="health_goal"
            value={formData.health_goal || ""}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* 알레르기 관리 */}
        <div>
          <label className="block text-sm font-medium mb-1">알레르기 정보</label>
          {isEditing && (
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                placeholder="추가할 알레르기 입력"
                className="flex-1 border p-2 rounded"
              />
              <button
                onClick={handleAddAllergy}
                className="bg-blue-500 text-white px-4 py-1 rounded"
              >
                추가
              </button>
            </div>
          )}
          <ul className="space-y-1">
            {(formData.allergies || []).map((a, idx) => (
              <li key={idx} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                <span>{a}</span>
                {isEditing && (
                  <button
                    onClick={() => handleRemoveAllergy(a)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    삭제
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              저장
            </button>
            <button
              onClick={() => {
                setFormData(profile);
                setIsEditing(false);
              }}
              className="border px-4 py-2 rounded"
            >
              취소
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            수정하기
          </button>
        )}
      </div>
    </div>
  );
}

export default ProfileComponent;