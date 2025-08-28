import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Eye, Heart, Globe, Calendar, Lightbulb, Shield, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AboutPage() {
  const achievements = [
    {
      icon: Lightbulb,
      title: "Innovatsion yondashuv",
      description: "Zamonaviy texnologiyalar va ilmiy metodlar asosida yaratilgan",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Shield,
      title: "Ishonchli manba",
      description: "Ekspert tomonidan tekshirilgan va tasdiqlangan materiallar",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: Globe,
      title: "Ochiq kirish",
      description: "Dunyo bo'ylab barcha tadqiqotchilar uchun ochiq platforma",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Zap,
      title: "Tez va oson",
      description: "Intuitiv interfeys va tezkor qidiruv imkoniyatlari",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
  ]

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 responsive-padding bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 text-balance">
            Loyiha haqida
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-4xl mx-auto text-pretty leading-relaxed">
            Art&Culture - O'zbekiston madaniyati va san'ati sohasidagi ilmiy bilimlarni tizimlashtirish va keng
            jamoatchilikka yetkazish maqsadida yaratilgan zamonaviy raqamli platforma
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16 responsive-padding">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 sm:mb-16">
            {/* About Text */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 text-balance">Loyihaning maqsadi</h2>
                <p className="text-muted-foreground leading-relaxed responsive-text">
                  Art&Culture portali O'zbekiston Madaniyat va San'at Instituti tomonidan 2020-yilda boshlangan va madaniyat,
                  san'at sohasidagi ilmiy tadqiqotlarni rivojlantirish, saqlash va tarqatishga qaratilgan. Portal
                  talabalar, tadqiqotchilar, olimlar va madaniyat sohasida faoliyat yurituvchi barcha mutaxassislar
                  uchun mo'ljallangan.
                </p>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-3">Asosiy vazifalar</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span className="responsive-text">Ilmiy jurnallar va kitoblarni raqamlashtirish va saqlash</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                    <span className="responsive-text">Tadqiqotchilar o'rtasida ilmiy hamkorlikni rivojlantirish</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span className="responsive-text">Madaniy merosni keng jamoatchilikka yetkazish</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                    <span className="responsive-text">Zamonaviy texnologiyalar orqali ta'lim sifatini oshirish</span>
                  </li>
                </ul>
              </div>

              <Button size="lg" asChild className="hover-secondary">
                <Link href="/contact">Biz bilan bog'laning</Link>
              </Button>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="aspect-[4/3] relative overflow-hidden rounded-lg shadow-lg">
                <Image
                  src="/placeholder.svg?key=about-hero"
                  alt="Art&Culture portali haqida"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="mb-12 sm:mb-16">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance">
                Bizning afzalliklarimiz
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                Art&Culture portalini boshqa platformalardan ajratib turadigan asosiy xususiyatlar
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {achievements.map((achievement, index) => {
                const IconComponent = achievement.icon
                return (
                  <Card
                    key={index}
                    className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border-0 shadow-md"
                  >
                    <CardContent className="p-6 space-y-4">
                      <div className={`mx-auto mb-4 p-4 rounded-full ${achievement.bgColor} w-fit`}>
                        <IconComponent className={`h-6 w-6 sm:h-8 sm:w-8 ${achievement.color}`} />
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
                <CardTitle className="text-xl sm:text-2xl">Missiya</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center leading-relaxed responsive-text">
                  O'zbekiston madaniyati va san'atining boy merosini zamonaviy texnologiyalar yordamida saqlash,
                  o'rganish va kelajak avlodlarga yetkazish.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 rounded-full bg-secondary/10 w-fit">
                  <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-secondary" />
                </div>
                <CardTitle className="text-xl sm:text-2xl">Vizyon</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center leading-relaxed responsive-text">
                  Markaziy Osiyodagi eng yirik va nufuzli madaniy-ilmiy raqamli platforma bo'lib, xalqaro miqyosda tan
                  olinish.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 w-fit">
                  <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <CardTitle className="text-xl sm:text-2xl">Qadriyatlar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center leading-relaxed responsive-text">
                  Ilmiy halollik, madaniy merosga hurmat, innovatsion yondashuv, ochiqlik va hamkorlik tamoyillari.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Team Section */}
          <div className="mb-12 sm:mb-16">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance">
                Bizning jamoa
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                Loyihani amalga oshirayotgan tajribali mutaxassislar jamoasi
              </p>
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
                Loyiha tarixi
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground text-pretty">Loyihaning rivojlanish bosqichlari</p>
            </div>

            <div className="space-y-6 sm:space-y-8 max-w-3xl mx-auto">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
                </div>
                <div className="pt-1">
                  <h3 className="font-semibold text-foreground mb-2 text-lg">2020 - Loyiha boshlandi</h3>
                  <p className="text-muted-foreground responsive-text">
                    O'zbekiston Madaniyat va San'at Instituti tomonidan Art&Culture portali loyihasi boshlandi.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-secondary rounded-full flex items-center justify-center shadow-lg">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-secondary-foreground" />
                </div>
                <div className="pt-1">
                  <h3 className="font-semibold text-foreground mb-2 text-lg">2021 - Beta versiya</h3>
                  <p className="text-muted-foreground responsive-text">
                    Portalning beta versiyasi ishga tushirildi va dastlabki foydalanuvchilar jalb qilindi.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
                </div>
                <div className="pt-1">
                  <h3 className="font-semibold text-foreground mb-2 text-lg">2022 - Rasmiy ochilish</h3>
                  <p className="text-muted-foreground responsive-text">
                    Portal rasmiy ravishda ochildi va barcha asosiy funksiyalar ishga tushirildi.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-secondary rounded-full flex items-center justify-center shadow-lg">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-secondary-foreground" />
                </div>
                <div className="pt-1">
                  <h3 className="font-semibold text-foreground mb-2 text-lg">2024 - Yangi imkoniyatlar</h3>
                  <p className="text-muted-foreground responsive-text">
                    Yangi raqamli kutubxona tizimi va kengaytirilgan qidiruv imkoniyatlari qo'shildi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
