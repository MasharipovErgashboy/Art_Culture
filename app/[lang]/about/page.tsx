import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Eye, Heart, Globe, Calendar, Lightbulb, Shield, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const translations = {
  uz: {
    title: "Biz haqimizda",
    projectGoal: "Loyihaning maqsadi",
    projectDescription:
      "Art&Culture portali O'zbekiston Madaniyat va San'at Instituti tomonidan 2020-yilda boshlangan va madaniyat, san'at sohasidagi ilmiy tadqiqotlarni rivojlantirish, saqlash va tarqatishga qaratilgan. Portal talabalar, tadqiqotchilar, olimlar va madaniyat sohasida faoliyat yurituvchi barcha mutaxassislar uchun mo'ljallangan.",
    mainTasks: "Asosiy vazifalar",
    tasks: [
      "Ilmiy jurnallar va kitoblarni raqamlashtirish va saqlash",
      "Tadqiqotchilar o'rtasida ilmiy hamkorlikni rivojlantirish",
      "Madaniy merosni keng jamoatchilikka yetkazish",
      "Zamonaviy texnologiyalar orqali ta'lim sifatini oshirish",
    ],
    contactUs: "Biz bilan bog'laning",
    ourAdvantages: "Bizning afzalliklarimiz",
    advantagesSubtitle: "Art&Culture portalini boshqa platformalardan ajratib turadigan asosiy xususiyatlar",
    achievements: [
      {
        title: "Innovatsion yondashuv",
        description: "Zamonaviy texnologiyalar va ilmiy metodlar asosida yaratilgan",
      },
      {
        title: "Ishonchli manba",
        description: "Ekspert tomonidan tekshirilgan va tasdiqlangan materiallar",
      },
      {
        title: "Ochiq kirish",
        description: "Dunyo bo'ylab barcha tadqiqotchilar uchun ochiq platforma",
      },
      {
        title: "Tez va oson",
        description: "Intuitiv interfeys va tezkor qidiruv imkoniyatlari",
      },
    ],
    mission: "Missiya",
    missionText:
      "O'zbekiston madaniyati va san'atining boy merosini zamonaviy texnologiyalar yordamida saqlash, o'rganish va kelajak avlodlarga yetkazish.",
    vision: "Vizyon",
    visionText:
      "Markaziy Osiyodagi eng yirik va nufuzli madaniy-ilmiy raqamli platforma bo'lib, xalqaro miqyosda tan olinish.",
    values: "Qadriyatlar",
    valuesText: "Ilmiy halollik, madaniy merosga hurmat, innovatsion yondashuv, ochiqlik va hamkorlik tamoyillari.",
    ourTeam: "Bizning jamoa",
    teamSubtitle: "Loyihani amalga oshirayotgan tajribali mutaxassislar jamoasi",
    projectHistory: "Loyiha tarixi",
    historySubtitle: "Loyihaning rivojlanish bosqichlari",
    timeline: [
      {
        year: "2020 - Loyiha boshlandi",
        description: "O'zbekiston Madaniyat va San'at Instituti tomonidan Art&Culture portali loyihasi boshlandi.",
      },
      {
        year: "2021 - Beta versiya",
        description: "Portalning beta versiyasi ishga tushirildi va dastlabki foydalanuvchilar jalb qilindi.",
      },
      {
        year: "2022 - Rasmiy ochilish",
        description: "Portal rasmiy ravishda ochildi va barcha asosiy funksiyalar ishga tushirildi.",
      },
      {
        year: "2024 - Yangi imkoniyatlar",
        description: "Yangi raqamli kutubxona tizimi va kengaytirilgan qidiruv imkoniyatlari qo'shildi.",
      },
    ],
  },
  ru: {
    title: "О нас",
    projectGoal: "Цель проекта",
    projectDescription:
      "Портал Art&Culture был запущен Узбекским институтом культуры и искусства в 2020 году и направлен на развитие, сохранение и распространение научных исследований в области культуры и искусства. Портал предназначен для студентов, исследователей, ученых и всех специалистов, работающих в сфере культуры.",
    mainTasks: "Основные задачи",
    tasks: [
      "Оцифровка и хранение научных журналов и книг",
      "Развитие научного сотрудничества между исследователями",
      "Донесение культурного наследия до широкой общественности",
      "Повышение качества образования через современные технологии",
    ],
    contactUs: "Свяжитесь с нами",
    ourAdvantages: "Наши преимущества",
    advantagesSubtitle: "Ключевые особенности, отличающие портал Art&Culture от других платформ",
    achievements: [
      {
        title: "Инновационный подход",
        description: "Создан на основе современных технологий и научных методов",
      },
      {
        title: "Надежный источник",
        description: "Материалы проверены и одобрены экспертами",
      },
      {
        title: "Открытый доступ",
        description: "Открытая платформа для всех исследователей по всему миру",
      },
      {
        title: "Быстро и легко",
        description: "Интуитивный интерфейс и возможности быстрого поиска",
      },
    ],
    mission: "Миссия",
    missionText:
      "Сохранение, изучение и передача богатого наследия культуры и искусства Узбекистана будущим поколениям с помощью современных технологий.",
    vision: "Видение",
    visionText:
      "Стать крупнейшей и наиболее авторитетной культурно-научной цифровой платформой в Центральной Азии с международным признанием.",
    values: "Ценности",
    valuesText:
      "Принципы научной честности, уважения к культурному наследию, инновационного подхода, открытости и сотрудничества.",
    ourTeam: "Наша команда",
    teamSubtitle: "Команда опытных специалистов, реализующих проект",
    projectHistory: "История проекта",
    historySubtitle: "Этапы развития проекта",
    timeline: [
      {
        year: "2020 - Запуск проекта",
        description: "Узбекский институт культуры и искусства запустил проект портала Art&Culture.",
      },
      {
        year: "2021 - Бета-версия",
        description: "Запущена бета-версия портала и привлечены первые пользователи.",
      },
      {
        year: "2022 - Официальное открытие",
        description: "Портал официально открыт, и все основные функции запущены.",
      },
      {
        year: "2024 - Новые возможности",
        description: "Добавлена новая система цифровой библиотеки и расширенные возможности поиска.",
      },
    ],
  },
  en: {
    title: "About Us",
    projectGoal: "Project Goal",
    projectDescription:
      "The Art&Culture portal was launched by the Uzbekistan Institute of Culture and Art in 2020 and is aimed at developing, preserving, and disseminating scientific research in the field of culture and art. The portal is intended for students, researchers, scientists, and all professionals working in the field of culture.",
    mainTasks: "Main Tasks",
    tasks: [
      "Digitization and storage of scientific journals and books",
      "Development of scientific cooperation between researchers",
      "Bringing cultural heritage to the general public",
      "Improving the quality of education through modern technologies",
    ],
    contactUs: "Contact Us",
    ourAdvantages: "Our Advantages",
    advantagesSubtitle: "Key features that distinguish the Art&Culture portal from other platforms",
    achievements: [
      {
        title: "Innovative Approach",
        description: "Created based on modern technologies and scientific methods",
      },
      {
        title: "Reliable Source",
        description: "Materials verified and approved by experts",
      },
      {
        title: "Open Access",
        description: "Open platform for all researchers worldwide",
      },
      {
        title: "Fast and Easy",
        description: "Intuitive interface and fast search capabilities",
      },
    ],
    mission: "Mission",
    missionText:
      "Preserving, studying, and passing on the rich heritage of Uzbekistan's culture and art to future generations using modern technologies.",
    vision: "Vision",
    visionText:
      "To become the largest and most authoritative cultural and scientific digital platform in Central Asia with international recognition.",
    values: "Values",
    valuesText:
      "Principles of scientific integrity, respect for cultural heritage, innovative approach, openness, and cooperation.",
    ourTeam: "Our Team",
    teamSubtitle: "Team of experienced specialists implementing the project",
    projectHistory: "Project History",
    historySubtitle: "Stages of project development",
    timeline: [
      {
        year: "2020 - Project Launch",
        description: "The Uzbekistan Institute of Culture and Art launched the Art&Culture portal project.",
      },
      {
        year: "2021 - Beta Version",
        description: "The beta version of the portal was launched and the first users were attracted.",
      },
      {
        year: "2022 - Official Opening",
        description: "The portal was officially opened and all main functions were launched.",
      },
      {
        year: "2024 - New Features",
        description: "A new digital library system and advanced search capabilities were added.",
      },
    ],
  },
}

const team = [
  {
    name: "Prof. Karimov Abdulla Bakhtiyor o'g'li",
    position: "Loyiha rahbari",
    department: "Madaniyatshunoslik fakulteti",
    image: "/placeholder.svg?key=team1",
    description: "Madaniyatshunoslik sohasida 25 yillik tajribaga ega, 150 dan ortiq ilmiy ishlar muallifi.",
  },
  {
    name: "Prof. Rahimova Saida Karimovna",
    position: "Ilmiy rahbar",
    department: "San'atshunoslik fakulteti",
    image: "/placeholder.svg?key=team2",
    description: "San'atshunoslik va madaniy meros sohasida taniqli mutaxassis, 200 dan ortiq maqola muallifi.",
  },
  {
    name: "Dotsent Yusupova Dilnoza Rahimovna",
    position: "Texnik rahbar",
    department: "Raqamli texnologiyalar bo'limi",
    image: "/placeholder.svg?key=team3",
    description: "Raqamli kutubxonalar va ma'lumot tizimlari sohasida 15 yillik tajribaga ega.",
  },
]

export default function AboutPage({ params }: { params: { lang: string } }) {
  const lang = params.lang || "uz"
  const t = translations[lang as keyof typeof translations] || translations.uz

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Main Content */}
      <section className="py-12 sm:py-16 px-6 md:px-8 lg:px-12">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 sm:mb-16">
            {/* About Text */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 text-balance">{t.projectGoal}</h2>
                <p className="text-muted-foreground leading-relaxed responsive-text">{t.projectDescription}</p>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-3">{t.mainTasks}</h3>
                <ul className="space-y-3 text-muted-foreground">
                  {t.tasks.map((task, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span
                        className={`w-2 h-2 ${index % 2 === 0 ? "bg-primary" : "bg-secondary"} rounded-full mt-2 flex-shrink-0`}
                      ></span>
                      <span className="responsive-text">{task}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button size="lg" asChild className="hover-secondary">
                <Link href={`/${lang}/contact`}>{t.contactUs}</Link>
              </Button>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="aspect-[4/3] relative overflow-hidden rounded-lg shadow-lg">
                <Image src="/placeholder.svg?key=about-hero" alt={t.title} fill className="object-cover" />
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="mb-12 sm:mb-16">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance">
                {t.ourAdvantages}
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                {t.advantagesSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {t.achievements.map((achievement, index) => {
                const icons = [Lightbulb, Shield, Globe, Zap]
                const IconComponent = icons[index]
                const colors = ["text-primary", "text-secondary", "text-primary", "text-secondary"]
                const bgColors = ["bg-primary/10", "bg-secondary/10", "bg-primary/10", "bg-secondary/10"]
                return (
                  <Card
                    key={index}
                    className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border-0 shadow-md"
                  >
                    <CardContent className="p-6 space-y-4">
                      <div className={`mx-auto mb-4 p-4 rounded-full ${bgColors[index]} w-fit`}>
                        <IconComponent className={`h-6 w-6 sm:h-8 sm:w-8 ${colors[index]}`} />
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-foreground">{achievement.title}</h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {achievement.description}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Mission, Vision, Values */}
          <div className="responsive-grid mb-12 sm:mb-16">
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 w-fit">
                  <Target className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <CardTitle className="text-xl sm:text-2xl">{t.mission}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center leading-relaxed responsive-text">{t.missionText}</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 rounded-full bg-secondary/10 w-fit">
                  <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-secondary" />
                </div>
                <CardTitle className="text-xl sm:text-2xl">{t.vision}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center leading-relaxed responsive-text">{t.visionText}</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 w-fit">
                  <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <CardTitle className="text-xl sm:text-2xl">{t.values}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center leading-relaxed responsive-text">{t.valuesText}</p>
              </CardContent>
            </Card>
          </div>

          {/* Team Section */}
          <div className="mb-12 sm:mb-16">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance">
                {t.ourTeam}
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">{t.teamSubtitle}</p>
            </div>

            <div className="responsive-grid">
              {team.map((member, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full overflow-hidden shadow-md">
                      <Image
                        src={member.image || "/placeholder.svg"}
                        alt={member.name}
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2 text-lg">{member.name}</h3>
                      <Badge className="mb-2 bg-secondary/10 text-secondary border-secondary/20">
                        {member.position}
                      </Badge>
                      <p className="text-sm text-muted-foreground mb-3">{member.department}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{member.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance">
                {t.projectHistory}
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground text-pretty">{t.historySubtitle}</p>
            </div>

            <div className="space-y-6 sm:space-y-8 max-w-3xl mx-auto">
              {t.timeline.map((item, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div
                    className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 ${index % 2 === 0 ? "bg-primary" : "bg-secondary"} rounded-full flex items-center justify-center shadow-lg`}
                  >
                    <Calendar
                      className={`h-5 w-5 sm:h-6 sm:w-6 ${index % 2 === 0 ? "text-primary-foreground" : "text-secondary-foreground"}`}
                    />
                  </div>
                  <div className="pt-1">
                    <h3 className="font-semibold text-foreground mb-2 text-lg">{item.year}</h3>
                    <p className="text-muted-foreground responsive-text">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
