"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ExternalLink, FileText } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

// Mock data for updates
const updatesData = {
  "uzbekistan-culture-art": {
    "update-1": {
      id: "update-1",
      title: "4-son (2024) - Yangi maqolalar",
      date: "2024-03-15",
      description:
        "O'zbekiston xalq san'ati va zamonaviy madaniyat o'rtasidagi bog'liqlik haqida yangi tadqiqotlar. Bu sonda 18 ta ilmiy maqola joylashtirilgan bo'lib, ular O'zbekiston madaniyatining turli jihatlarini qamrab oladi.",
      tableOfContents: [
        {
          title: "O'zbekiston xalq san'atida zamonaviy tendensiyalar",
          author: "Karimov A.B.",
          pages: "5-18",
          pdfUrl: "#",
        },
        {
          title: "Buxoro hunarmandchiligining tarixiy rivojlanishi",
          author: "Rahimova S.K.",
          pages: "19-32",
          pdfUrl: "#",
        },
        {
          title: "O'zbek folklori va zamonaviy adabiyot",
          author: "Abdullayev M.N.",
          pages: "33-48",
          pdfUrl: "#",
        },
        {
          title: "Markaziy Osiyo musiqiy merosining o'rganilishi",
          author: "Yusupova D.R.",
          pages: "49-64",
          pdfUrl: "#",
        },
        {
          title: "Samarqand me'morchiligining san'at jihatdan tahlili",
          author: "Toshmatov B.A.",
          pages: "65-78",
          pdfUrl: "#",
        },
      ],
    },
    "update-2": {
      id: "update-2",
      title: "3-son (2024) - Maxsus nashr",
      date: "2024-02-10",
      description:
        "Amir Temur davri madaniyati va san'atiga bag'ishlangan maxsus nashr. Bu son Temuriylar davri san'ati, me'morchiligi va madaniy yutuqlariga bag'ishlangan.",
      tableOfContents: [
        {
          title: "Temuriylar davri me'morchiligi",
          author: "Nazarov K.T.",
          pages: "3-22",
          pdfUrl: "#",
        },
        {
          title: "Samarqand Registon majmuasi tahlili",
          author: "Mirzayev A.S.",
          pages: "23-40",
          pdfUrl: "#",
        },
      ],
    },
  },
}

export default function UpdateDetailPage({
  params,
}: {
  params: { id: string; updateId: string }
}) {
  const journalUpdates = updatesData[params.id as keyof typeof updatesData]
  if (!journalUpdates) {
    notFound()
  }

  const update = journalUpdates[params.updateId as keyof typeof journalUpdates]
  if (!update) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Breadcrumb */}
      <section className="py-6 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              Bosh sahifa
            </Link>
            <span>/</span>
            <Link href="/journals" className="hover:text-primary">
              Jurnallar
            </Link>
            <span>/</span>
            <Link href={`/journals/${params.id}`} className="hover:text-primary">
              Jurnal
            </Link>
            <span>/</span>
            <span className="text-foreground">Yangilanish</span>
          </div>
        </div>
      </section>

      {/* Update Detail */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-8">
            <div>
              <Button variant="ghost" asChild className="mb-6 p-0 h-auto">
                <Link
                  href={`/journals/${params.id}`}
                  className="flex items-center text-muted-foreground hover:text-primary"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Jurnalga qaytish
                </Link>
              </Button>
            </div>

            {/* Update Header */}
            <div className="text-center space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">{update.title}</h1>
              <p className="text-lg text-muted-foreground">{update.date}</p>
            </div>

            {/* Update Description */}
            <Card>
              <CardHeader>
                <CardTitle>Yangilanish haqida</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{update.description}</p>
              </CardContent>
            </Card>

            {/* Table of Contents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                    Bo'limlar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {update.tableOfContents.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>
                            <strong>Muallif:</strong> {item.author}
                          </span>
                          <span>
                            <strong>Sahifalar:</strong> {item.pages}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent"
                        onClick={() => window.open(item.pdfUrl, "_blank")}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        PDF
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-center space-x-4">
              <Button size="lg">To'liq jurnalni sotib olish</Button>
              <Button variant="outline" size="lg" className="bg-transparent">
                Boshqa yangilanishlar
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
