import React from "react";
import { Link } from 'react-router-dom';
import chatbot from "../asset/icon/chatbot.png";
import calendar from "../asset/icon/calendar.png";
import chart from "../asset/icon/chart.png";
import document from "../asset/icon/document.png";
import logo from "../asset/icon/logo.png";
import ticket from "../asset/icon/ticket.png";
import setting from "../asset/icon/setting.png";
import menu from "../asset/icon/menu.png";
import recipe from "../asset/icon/recipe.png"

const handleAlert = () => {
    alert("아직 준비중입니다.");
};

const SidebarComponent = () => {
    return (
        <div className="relative w-56 h-screen bg-white caret-transparent">
            <div className="fixed w-56 h-screen top-0 left-0 bg-white flex flex-col justify-between">
                <div>
                    <div className="flex flex-col items-center py-10">
                        <Link to="/">
                            <img src={logo} alt="Logo" className="w-16 h-16 mb-4 cursor-pointer hover:opacity-80"/>
                        </Link>
                        <h1 className="text-2xl font-semibold text-gray-800">Brand Name</h1>
                    </div>
                    <div className="flex flex-col items-start pr-8 pl-8 space-y-6">
                        <div className="flex items-center space-x-4 cursor-pointer" onClick={handleAlert}>
                            <img src={menu} alt="menu" className="w-6 h-6 opacity-30 hover:opacity-50"/>
                            <span className="text-base font-semibold text-gray-600 hover:text-blue-500">Menu</span>
                        </div>
                        <div className="flex items-center space-x-4 cursor-pointer">
                            <img src={chart} alt="Chart" className="w-6 h-6 opacity-30 hover:opacity-50"/>
                            <Link to="/Analysis" className="text-base font-semibold text-gray-600 hover:text-blue-500">
                                식단분석결과
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4 cursor-pointer">
                            <img src={ticket} alt="Ticket" className="w-6 h-6 opacity-30 hover:opacity-50"/>
                            <Link to="/Records" className="text-base font-semibold text-gray-600 hover:text-blue-500">
                                식단기록
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4 cursor-pointer">
                            <img src={document} alt="Document" className="w-6 h-6 opacity-30 hover:opacity-50"/>
                            <Link to="/Recommend" className="text-base font-semibold text-gray-600 hover:text-blue-500">
                                맞춤식단 추천
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4 cursor-pointer">
                            <img src={recipe} alt="recipe" className="w-6 h-6 opacity-30 hover:opacity-50"/>
                            <Link to="/recipe" className="text-base font-semibold text-gray-600 hover:text-blue-500">
                                레시피 추천
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4 cursor-pointer" onClick={handleAlert}>
                            <img src={calendar} alt="Calendar" className="w-6 h-6 opacity-30 hover:opacity-50"/>
                            <span className="text-base font-semibold text-gray-600 hover:text-blue-500">Calendar</span>
                        </div>
                        <div className="flex items-center space-x-4 relative cursor-pointer">
                            <img src={chatbot} alt="Chatbot" className="w-6 h-6 opacity-30 hover:opacity-50"/>
                            <Link to="/chatbot" className="text-base font-semibold text-gray-600 hover:text-blue-500">
                                Chatbot
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4 pt-8 cursor-pointer" onClick={handleAlert}>
                            <img src={setting} alt="Setting" className="w-6 h-6 opacity-30 hover:opacity-50"/>
                            <span className="text-base font-semibold text-gray-600 hover:text-blue-500">마이페이지</span>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end pb-10 pr-8 cursor-pointer">
                    <span className="text-base font-semibold text-gray-600 hover:text-red-500">Logout</span>
                </div>
            </div>
        </div>
    );
};

export default SidebarComponent;
