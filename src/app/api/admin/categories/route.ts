import { PrismaClient } from '../../../../generated/prisma'
import { NextRequest, NextResponse } from 'next/server'

interface CreateCategoryRequestBody {
  name: string
}

const prisma = new PrismaClient()

export const GET = async (request: NextRequest) => {
  try {
    // カテゴリーの一覧をDBから取得
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: 'desc', // 作成日時の降順で取得
      },
    })

    // レスポンスを返す
    return NextResponse.json({ status: 'OK', categories }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}


export const POST = async (request: Request, context: any) => {
  try {
    // リクエストのbodyを取得
    const body = await request.json()

    // bodyの中からnameを取り出す
    const { name }: CreateCategoryRequestBody = body

    // カテゴリーをDBに生成
    const data = await prisma.category.create({
      data: {
        name,
      },
    })

    // レスポンスを返す
    return NextResponse.json({
      status: 'OK',
      message: '作成しました',
      id: data.id,
    })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 })
    }
  }
}