// app/api/records/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 處理前端發送過來的 POST 請求 (新增資料)
export async function POST(request) {
  try {
    // 1. 解析前端傳過來的 JSON 資料
    const body = await request.json();
    const { userId, city, date, album, lat, lng } = body;

    // 2. 基本的防呆檢查：確保必要欄位都有值
    if (!userId || !city || lat === undefined || lng === undefined) {
      return NextResponse.json(
        { success: false, error: '缺少必要的旅遊資料欄位' }, 
        { status: 400 }
      );
    }

    // 3. 呼叫 Prisma 將資料寫入 Neon 資料庫
    const newRecord = await prisma.travelRecord.create({
      data: {
        userId: userId,
        city: city,
        date: date || '未提供日期',
        album: album || null,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      },
    });

    // 4. 成功儲存後，回傳成功的訊息與剛建立的資料給前端
    return NextResponse.json({ success: true, data: newRecord }, { status: 201 });

  } catch (error) {
    console.error('儲存至資料庫時發生錯誤:', error);
    return NextResponse.json(
      { success: false, error: '伺服器內部錯誤，儲存失敗' }, 
      { status: 500 }
    );
  }
}