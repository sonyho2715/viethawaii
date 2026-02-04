'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Phone, Sun, Moon } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const HAWAII_TZ = 'Pacific/Honolulu';
const VIETNAM_TZ = 'Asia/Ho_Chi_Minh';

export default function TimezoneConverterPage() {
  const { language } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hawaiiTime = new Date(currentTime.toLocaleString('en-US', { timeZone: HAWAII_TZ }));
  const vietnamTime = new Date(currentTime.toLocaleString('en-US', { timeZone: VIETNAM_TZ }));

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date, locale: string) => {
    return date.toLocaleDateString(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isNightTime = (date: Date) => {
    const hour = date.getHours();
    return hour < 7 || hour >= 22;
  };

  const isGoodCallTime = (vnHour: number) => {
    // Good times: 7am-10pm Vietnam time (which is 2pm-5am Hawaii time previous day)
    return vnHour >= 7 && vnHour < 22;
  };

  const vnHour = vietnamTime.getHours();
  const goodToCall = isGoodCallTime(vnHour);

  // Best calling times
  const bestTimes = [
    {
      hawaiiVn: '5:00 PM - 8:00 PM (Hawaii)',
      vietnamVn: '10:00 AM - 1:00 PM (Việt Nam)',
      hawaiiEn: '5:00 PM - 8:00 PM (Hawaii)',
      vietnamEn: '10:00 AM - 1:00 PM (Vietnam)',
      descVn: 'Sau giờ làm ở Hawaii, buổi trưa ở VN',
      descEn: 'After work in Hawaii, lunchtime in VN',
    },
    {
      hawaiiVn: '6:00 AM - 9:00 AM (Hawaii)',
      vietnamVn: '11:00 PM - 2:00 AM (Việt Nam)',
      hawaiiEn: '6:00 AM - 9:00 AM (Hawaii)',
      vietnamEn: '11:00 PM - 2:00 AM (Vietnam)',
      descVn: 'Sáng sớm ở Hawaii, khuya ở VN',
      descEn: 'Early morning in Hawaii, late night in VN',
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        href="/cong-cu"
        className="inline-flex items-center text-sm text-gray-600 hover:text-teal-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        {language === 'vn' ? 'Quay lại công cụ' : 'Back to tools'}
      </Link>

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-orange-500 to-red-600 mb-4">
          <Clock className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {language === 'vn' ? 'Giờ Việt Nam' : 'Vietnam Time'}
        </h1>
        <p className="text-gray-600">
          {language === 'vn'
            ? 'So sánh giờ Hawaii và Việt Nam'
            : 'Compare Hawaii and Vietnam time'}
        </p>
      </div>

      {/* Live Clocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Hawaii Time */}
        <div className={`rounded-2xl p-6 ${isNightTime(hawaiiTime) ? 'bg-slate-800 text-white' : 'bg-gradient-to-br from-blue-400 to-cyan-500 text-white'}`}>
          <div className="flex items-center gap-2 mb-3">
            {isNightTime(hawaiiTime) ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            <span className="text-sm font-medium opacity-90">Hawaii (HST)</span>
          </div>
          <p className="text-4xl font-bold font-mono mb-2">
            {formatTime(hawaiiTime)}
          </p>
          <p className="text-sm opacity-80">
            {formatDate(hawaiiTime, 'en-US')}
          </p>
        </div>

        {/* Vietnam Time */}
        <div className={`rounded-2xl p-6 ${isNightTime(vietnamTime) ? 'bg-slate-800 text-white' : 'bg-gradient-to-br from-red-500 to-yellow-500 text-white'}`}>
          <div className="flex items-center gap-2 mb-3">
            {isNightTime(vietnamTime) ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            <span className="text-sm font-medium opacity-90">Việt Nam (ICT)</span>
          </div>
          <p className="text-4xl font-bold font-mono mb-2">
            {formatTime(vietnamTime)}
          </p>
          <p className="text-sm opacity-80">
            {formatDate(vietnamTime, 'vi-VN')}
          </p>
        </div>
      </div>

      {/* Call Status */}
      <div className={`p-4 rounded-xl mb-8 ${goodToCall ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
        <div className="flex items-center gap-3">
          <Phone className={`h-5 w-5 ${goodToCall ? 'text-green-600' : 'text-amber-600'}`} />
          <div>
            <p className={`font-semibold ${goodToCall ? 'text-green-800' : 'text-amber-800'}`}>
              {goodToCall
                ? (language === 'vn' ? 'Thời điểm tốt để gọi điện!' : 'Good time to call!')
                : (language === 'vn' ? 'Việt Nam đang nghỉ ngơi' : 'Vietnam is resting')}
            </p>
            <p className={`text-sm ${goodToCall ? 'text-green-600' : 'text-amber-600'}`}>
              {language === 'vn'
                ? `Việt Nam: ${vnHour}:00 - ${vnHour >= 7 && vnHour < 22 ? 'Giờ thức' : 'Giờ nghỉ'}`
                : `Vietnam: ${vnHour}:00 - ${vnHour >= 7 && vnHour < 22 ? 'Awake hours' : 'Sleep hours'}`}
            </p>
          </div>
        </div>
      </div>

      {/* Time Difference */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
        <h2 className="font-semibold text-gray-900 mb-4">
          {language === 'vn' ? 'Chênh lệch múi giờ' : 'Time Difference'}
        </h2>
        <div className="text-center py-4 bg-gray-50 rounded-xl">
          <p className="text-5xl font-bold text-gray-900">+17</p>
          <p className="text-gray-600 mt-1">
            {language === 'vn' ? 'giờ' : 'hours'}
          </p>
        </div>
        <p className="text-sm text-gray-500 text-center mt-3">
          {language === 'vn'
            ? 'Việt Nam sớm hơn Hawaii 17 giờ'
            : 'Vietnam is 17 hours ahead of Hawaii'}
        </p>
      </div>

      {/* Best Calling Times */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Phone className="h-5 w-5 text-teal-600" />
          {language === 'vn' ? 'Thời điểm tốt nhất để gọi' : 'Best Times to Call'}
        </h2>
        <div className="space-y-4">
          {bestTimes.map((time, i) => (
            <div key={i} className="p-4 bg-teal-50 rounded-xl">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Hawaii</p>
                  <p className="font-medium text-gray-900">
                    {language === 'vn' ? time.hawaiiVn : time.hawaiiEn}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">{language === 'vn' ? 'Việt Nam' : 'Vietnam'}</p>
                  <p className="font-medium text-gray-900">
                    {language === 'vn' ? time.vietnamVn : time.vietnamEn}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                {language === 'vn' ? time.descVn : time.descEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
