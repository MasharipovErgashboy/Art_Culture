import { type NextRequest, NextResponse } from "next/server"
import type { ContactFormData, ContactSubmissionResponse } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json({ success: false, message: "Barcha maydonlar to'ldirilishi shart" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ success: false, message: "Email manzil noto'g'ri formatda" }, { status: 400 })
    }

    // Here you would typically:
    // 1. Save to database
    // 2. Send email notification
    // 3. Log the submission

    console.log("Contact form submission:", body)

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const response: ContactSubmissionResponse = {
      success: true,
      message: "Xabaringiz muvaffaqiyatli yuborildi. Biz tez orada siz bilan bog'lanamiz.",
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json(
      { success: false, message: "Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring." },
      { status: 500 },
    )
  }
}
