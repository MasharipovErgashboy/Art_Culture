"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  MessageSquare,
  Users,
  BookOpen,
} from "lucide-react"

const translations = {
  uz: {
    title: "Bog'lanish",
    sendMessage: "Xabar yuborish",
    formDescription: "Quyidagi formani to'ldiring va biz tez orada siz bilan bog'lanamiz.",
    messageSent: "Xabar yuborildi!",
    messageSuccess: "Sizning xabaringiz muvaffaqiyatli yuborildi. Biz tez orada siz bilan bog'lanamiz.",
    fullName: "Ism va familiya",
    fullNamePlaceholder: "Ismingiz va familiyangiz",
    email: "Email manzil",
    emailPlaceholder: "example@email.com",
    subject: "Mavzu",
    subjectPlaceholder: "Xabar mavzusi",
    message: "Xabar",
    messagePlaceholder: "Xabaringizni bu yerga yozing...",
    sending: "Yuborilmoqda...",
    sendButton: "Xabar yuborish",
    contactInfo: "Aloqa ma'lumotlari",
    address: "Manzil",
    addressDetails: "О'zbekiston Respublikasi Toshkent sh. Mirzo Ulug'bek tumani, Yalang'och dahasi 127 «A» uy. 100164",
    phone: "Telefon",
    workingHours: "Ish vaqti",
    workingHoursDetails: ["Dushanba - Juma: 9:00 - 18:00", "Shanba: 9:00 - 14:00", "Yakshanba: Dam olish kuni"],
    departments: "Bo'limlar",
    departmentsSubtitle: "Muayyan masalalar bo'yicha to'g'ridan-to'g'ri tegishli bo'lim bilan bog'laning",
    departmentsList: [
      {
        name: "Ilmiy bo'lim",
        email: "science@artculture.uz",
        phone: "+998 71 227 12 26",
        description: "Ilmiy nashrlar va tadqiqotlar bo'yicha savollar",
      },
      {
        name: "Texnik yordam",
        email: "support@artculture.uz",
        phone: "+998 71 227 12 27",
        description: "Portal ishida texnik muammolar",
      },
      {
        name: "Hamkorlik bo'limi",
        email: "partnership@artculture.uz",
        phone: "+998 71 227 12 28",
        description: "Hamkorlik va loyihalar bo'yicha takliflar",
      },
    ],
    faqTitle: "Tez-tez so'raladigan savollar",
    faqSubtitle: "Eng ko'p so'raladigan savollar va batafsil javoblar",
    faqList: [
      {
        category: "Foydalanuvchi hisobi",
        question: "Portaldan qanday foydalanish mumkin?",
        answer:
          "Portal bepul foydalanish uchun ochiq. Ro'yxatdan o'tish orqali barcha imkoniyatlardan foydalanishingiz mumkin. Shaxsiy kabinetingizda sevimli maqolalar va kitoblarni saqlash, yuklab olish tarixi va boshqa qulayliklardan foydalanishingiz mumkin.",
      },
      {
        category: "Nashr qilish",
        question: "Maqola yoki kitob qanday nashr qilish mumkin?",
        answer:
          "Maqola nashr qilish uchun ilmiy bo'lim bilan bog'laning. Barcha maqolalar ilmiy ekspertizadan o'tadi. Nashr qilish jarayoni: 1) Maqolani yuborish, 2) Ilmiy ekspertiza, 3) Tahrirlash, 4) Nashr qilish. Jarayon 2-4 hafta davom etadi.",
      },
      {
        category: "Texnik yordam",
        question: "Texnik yordam qanday olish mumkin?",
        answer:
          "Texnik muammolar uchun support@artculture.uz manziliga yozing yoki +998 71 227 12 27 raqamiga qo'ng'iroq qiling. Bizning texnik yordam jamoasi 24/7 ishlaydi va barcha muammolarni tezkor hal qiladi. Masofaviy yordam ham taqdim etamiz.",
      },
      {
        category: "Hamkorlik",
        question: "Hamkorlik qilish va loyiha taklif qilish mumkinmi?",
        answer:
          "Albatta! Hamkorlik takliflari uchun partnership@artculture.uz manziliga murojaat qiling. Biz universitetlar, tadqiqot markazlari va xalqaro tashkilotlar bilan hamkorlik qilishdan mamnunmiz. Loyiha takliflaringizni kutamiz.",
      },
      {
        category: "Kirish huquqlari",
        question: "Barcha materiallar bepulmi?",
        answer:
          "Portalning asosiy qismi bepul. Ba'zi premium kitoblar va maxsus tadqiqotlar uchun to'lov talab qilinishi mumkin. Talabalar va tadqiqotchilar uchun maxsus chegirmalar mavjud. Batafsil ma'lumot uchun biz bilan bog'laning.",
      },
      {
        category: "Jamoat aloqalari",
        question: "Konferensiya va tadbirlarda qanday qatnashish mumkin?",
        answer:
          "Bizning konferensiya va tadbirlar haqida ma'lumot olish uchun 'Konferensiya' bo'limiga tashrif buyuring. Ro'yxatdan o'tgan foydalanuvchilar barcha tadbirlar haqida email orqali xabardor qilinadi. Onlayn va oflayn tadbirlarda qatnashish mumkin.",
      },
    ],
    noAnswer: "Javobingizni topa olmadingizmi?",
    noAnswerSubtitle: "Biz bilan bog'laning, sizga yordam beramiz",
    askQuestion: "Savol berish",
  },
  ru: {
    title: "Контакты",
    sendMessage: "Отправить сообщение",
    formDescription: "Заполните форму ниже, и мы свяжемся с вами в ближайшее время.",
    messageSent: "Сообщение отправлено!",
    messageSuccess: "Ваше сообщение успешно отправлено. Мы свяжемся с вами в ближайшее время.",
    fullName: "Имя и фамилия",
    fullNamePlaceholder: "Ваше имя и фамилия",
    email: "Email адрес",
    emailPlaceholder: "example@email.com",
    subject: "Тема",
    subjectPlaceholder: "Тема сообщения",
    message: "Сообщение",
    messagePlaceholder: "Напишите ваше сообщение здесь...",
    sending: "Отправка...",
    sendButton: "Отправить сообщение",
    contactInfo: "Контактная информация",
    address: "Адрес",
    addressDetails: "Республика Узбекистан, г. Ташкент, Мирзо-Улугбекский район, массив Яланғоч, дом 127 «А». 100164",
    phone: "Телефон",
    workingHours: "Рабочие часы",
    workingHoursDetails: ["Понедельник - Пятница: 9:00 - 18:00", "Суббота: 9:00 - 14:00", "Воскресенье: Выходной"],
    departments: "Отделы",
    departmentsSubtitle: "Свяжитесь напрямую с соответствующим отделом по конкретным вопросам",
    departmentsList: [
      {
        name: "Научный отдел",
        email: "science@artculture.uz",
        phone: "+998 71 227 12 26",
        description: "Вопросы по научным публикациям и исследованиям",
      },
      {
        name: "Техническая поддержка",
        email: "support@artculture.uz",
        phone: "+998 71 227 12 27",
        description: "Технические проблемы с работой портала",
      },
      {
        name: "Отдел партнерства",
        email: "partnership@artculture.uz",
        phone: "+998 71 227 12 28",
        description: "Предложения по сотрудничеству и проектам",
      },
    ],
    faqTitle: "Часто задаваемые вопросы",
    faqSubtitle: "Наиболее часто задаваемые вопросы и подробные ответы",
    faqList: [
      {
        category: "Учетная запись пользователя",
        question: "Как пользоваться порталом?",
        answer:
          "Портал открыт для бесплатного использования. Зарегистрировавшись, вы можете использовать все возможности. В личном кабинете вы можете сохранять избранные статьи и книги, просматривать историю загрузок и пользоваться другими удобствами.",
      },
      {
        category: "Публикация",
        question: "Как опубликовать статью или книгу?",
        answer:
          "Для публикации статьи свяжитесь с научным отделом. Все статьи проходят научную экспертизу. Процесс публикации: 1) Отправка статьи, 2) Научная экспертиза, 3) Редактирование, 4) Публикация. Процесс занимает 2-4 недели.",
      },
      {
        category: "Техническая поддержка",
        question: "Как получить техническую поддержку?",
        answer:
          "По техническим вопросам пишите на support@artculture.uz или звоните по номеру +998 71 227 12 27. Наша команда технической поддержки работает 24/7 и быстро решает все проблемы. Также предоставляем удаленную помощь.",
      },
      {
        category: "Партнерство",
        question: "Можно ли сотрудничать и предлагать проекты?",
        answer:
          "Конечно! Для предложений о сотрудничестве обращайтесь на partnership@artculture.uz. Мы рады сотрудничать с университетами, исследовательскими центрами и международными организациями. Ждем ваших предложений по проектам.",
      },
      {
        category: "Права доступа",
        question: "Все материалы бесплатны?",
        answer:
          "Основная часть портала бесплатна. За некоторые премиум-книги и специальные исследования может взиматься плата. Для студентов и исследователей доступны специальные скидки. Для получения подробной информации свяжитесь с нами.",
      },
      {
        category: "Связи с общественностью",
        question: "Как участвовать в конференциях и мероприятиях?",
        answer:
          "Для получения информации о наших конференциях и мероприятиях посетите раздел 'Конференции'. Зарегистрированные пользователи получают уведомления обо всех мероприятиях по электронной почте. Можно участвовать в онлайн и офлайн мероприятиях.",
      },
    ],
    noAnswer: "Не нашли ответ?",
    noAnswerSubtitle: "Свяжитесь с нами, мы поможем",
    askQuestion: "Задать вопрос",
  },
  en: {
    title: "Contact",
    sendMessage: "Send Message",
    formDescription: "Fill out the form below and we will get back to you soon.",
    messageSent: "Message Sent!",
    messageSuccess: "Your message has been sent successfully. We will contact you soon.",
    fullName: "Full Name",
    fullNamePlaceholder: "Your full name",
    email: "Email Address",
    emailPlaceholder: "example@email.com",
    subject: "Subject",
    subjectPlaceholder: "Message subject",
    message: "Message",
    messagePlaceholder: "Write your message here...",
    sending: "Sending...",
    sendButton: "Send Message",
    contactInfo: "Contact Information",
    address: "Address",
    addressDetails:
      "Republic of Uzbekistan, Tashkent city, Mirzo Ulugbek district, Yalangoch massif, house 127 «A». 100164",
    phone: "Phone",
    workingHours: "Working Hours",
    workingHoursDetails: ["Monday - Friday: 9:00 - 18:00", "Saturday: 9:00 - 14:00", "Sunday: Day off"],
    departments: "Departments",
    departmentsSubtitle: "Contact the relevant department directly for specific issues",
    departmentsList: [
      {
        name: "Scientific Department",
        email: "science@artculture.uz",
        phone: "+998 71 227 12 26",
        description: "Questions about scientific publications and research",
      },
      {
        name: "Technical Support",
        email: "support@artculture.uz",
        phone: "+998 71 227 12 27",
        description: "Technical issues with the portal",
      },
      {
        name: "Partnership Department",
        email: "partnership@artculture.uz",
        phone: "+998 71 227 12 28",
        description: "Proposals for cooperation and projects",
      },
    ],
    faqTitle: "Frequently Asked Questions",
    faqSubtitle: "Most frequently asked questions and detailed answers",
    faqList: [
      {
        category: "User Account",
        question: "How to use the portal?",
        answer:
          "The portal is open for free use. By registering, you can use all the features. In your personal account, you can save favorite articles and books, view download history, and use other conveniences.",
      },
      {
        category: "Publishing",
        question: "How to publish an article or book?",
        answer:
          "To publish an article, contact the scientific department. All articles undergo scientific review. Publishing process: 1) Submit article, 2) Scientific review, 3) Editing, 4) Publication. The process takes 2-4 weeks.",
      },
      {
        category: "Technical Support",
        question: "How to get technical support?",
        answer:
          "For technical issues, write to support@artculture.uz or call +998 71 227 12 27. Our technical support team works 24/7 and quickly resolves all issues. We also provide remote assistance.",
      },
      {
        category: "Partnership",
        question: "Can I cooperate and propose projects?",
        answer:
          "Of course! For partnership proposals, contact partnership@artculture.uz. We are happy to cooperate with universities, research centers, and international organizations. We look forward to your project proposals.",
      },
      {
        category: "Access Rights",
        question: "Are all materials free?",
        answer:
          "The main part of the portal is free. Some premium books and special research may require payment. Special discounts are available for students and researchers. Contact us for more information.",
      },
      {
        category: "Public Relations",
        question: "How to participate in conferences and events?",
        answer:
          "To get information about our conferences and events, visit the 'Conferences' section. Registered users are notified of all events via email. You can participate in online and offline events.",
      },
    ],
    noAnswer: "Didn't find your answer?",
    noAnswerSubtitle: "Contact us, we will help you",
    askQuestion: "Ask a Question",
  },
}

export default function ContactPage({ params }: { params: { lang: string } }) {
  const lang = params.lang || "uz"
  const t = translations[lang as keyof typeof translations] || translations.uz

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [openFAQ, setOpenFAQ] = useState<number | null>(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate form submission
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
      setFormData({ name: "", email: "", subject: "", message: "" })

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: t.address,
      details: [t.addressDetails],
    },
    {
      icon: Phone,
      title: t.phone,
      details: ["(71)230-28-15", "(71)230-28-15"],
    },
    {
      icon: Mail,
      title: t.email,
      details: ["info@artculture.uz", "support@artculture.uz"],
    },
    {
      icon: Clock,
      title: t.workingHours,
      details: t.workingHoursDetails,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Main Content */}
      <section className="py-12 sm:py-16 px-6 md:px-8 lg:px-12">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 sm:mb-16">
            {/* Contact Form */}
            <div>
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground">{t.sendMessage}</CardTitle>
                  <p className="text-muted-foreground responsive-text">{t.formDescription}</p>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">{t.messageSent}</h3>
                      <p className="text-muted-foreground">{t.messageSuccess}</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">{t.fullName} *</Label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder={t.fullNamePlaceholder}
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">{t.email} *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder={t.emailPlaceholder}
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">{t.subject} *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          placeholder={t.subjectPlaceholder}
                          value={formData.subject}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">{t.message} *</Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder={t.messagePlaceholder}
                          value={formData.message}
                          onChange={handleChange}
                          rows={6}
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full hover-secondary" size="lg" disabled={isLoading}>
                        {isLoading ? (
                          t.sending
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            {t.sendButton}
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">{t.contactInfo}</h2>
                <div className="grid grid-cols-1 gap-6">
                  {contactInfo.map((info, index) => {
                    const IconComponent = info.icon
                    return (
                      <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full">
                              <IconComponent className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground mb-2">{info.title}</h3>
                              {info.details.map((detail, idx) => (
                                <p key={idx} className="text-muted-foreground responsive-text">
                                  {detail}
                                </p>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Departments */}
          <div className="mb-12 sm:mb-16">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance">
                {t.departments}
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground text-pretty">{t.departmentsSubtitle}</p>
            </div>

            <div className="responsive-grid">
              {t.departmentsList.map((dept, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl">{dept.name}</CardTitle>
                    <p className="text-muted-foreground responsive-text">{dept.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm sm:text-base">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${dept.email}`} className="text-primary hover:underline">
                          {dept.email}
                        </a>
                      </div>
                      <div className="flex items-center space-x-2 text-sm sm:text-base">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a href={`tel:${dept.phone}`} className="text-primary hover:underline">
                          {dept.phone}
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Enhanced FAQ Section */}
          <div>
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance">
                {t.faqTitle}
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground text-pretty">{t.faqSubtitle}</p>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              {t.faqList.map((faq, index) => {
                const icons = [Users, BookOpen, HelpCircle, MessageSquare, BookOpen, Users]
                const IconComponent = icons[index]
                const colors = [
                  "text-primary",
                  "text-secondary",
                  "text-primary",
                  "text-secondary",
                  "text-primary",
                  "text-secondary",
                ]
                const bgColors = [
                  "bg-primary/10",
                  "bg-secondary/10",
                  "bg-primary/10",
                  "bg-secondary/10",
                  "bg-primary/10",
                  "bg-secondary/10",
                ]
                const isOpen = openFAQ === index
                return (
                  <Card
                    key={index}
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md"
                  >
                    <CardHeader
                      className="cursor-pointer hover:bg-primary/5 transition-colors duration-200"
                      onClick={() => toggleFAQ(index)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-full ${bgColors[index]}`}>
                            <IconComponent className={`h-5 w-5 sm:h-6 sm:w-6 ${colors[index]}`} />
                          </div>
                          <div className="text-left">
                            <div className="text-xs sm:text-sm text-muted-foreground mb-1">{faq.category}</div>
                            <CardTitle className="text-lg sm:text-xl font-semibold text-foreground">
                              {faq.question}
                            </CardTitle>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {isOpen ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    {isOpen && (
                      <CardContent className="pt-0 pb-6">
                        <div className="ml-16 sm:ml-20">
                          <p className="text-muted-foreground leading-relaxed responsive-text">{faq.answer}</p>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                )
              })}
            </div>

            <div className="text-center mt-8 sm:mt-12">
              <Card className="inline-block p-6 bg-gradient-to-r from-primary/5 to-secondary/5">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <HelpCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-foreground mb-1">{t.noAnswer}</h3>
                    <p className="text-muted-foreground text-sm">{t.noAnswerSubtitle}</p>
                  </div>
                  <Button variant="outline" className="hover-secondary bg-transparent">
                    {t.askQuestion}
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
