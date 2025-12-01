import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding databese...")

    //Cria Admin
    const adminPassword = await bcrypt.hash("@adm1n678", 10)

    const admin = await prisma.user.upsert({
        where: { username: "admin" },
        update: {},
        create: {
            username: "admin",
            password: adminPassword,
            isAdmin: true
        }
    })

    console.log(`Admin created: ${admin.username}`)

    //Cria matérias
    const subjects = [
        {
            name: "Matemática Discreta (IB)",
            professor: "Grasiele Jorge",
            classes: {
                create: [
                { day: 1, time: 3, classroom: 302 },
                { day: 3, time: 3, classroom: 302 }
                ]
            }
        },
        {
            name: "Programação Orientada a Objetos (N)",
            professor: "Otávio Lemos",
            classes: {
                create: [
                { day: 1, time: 5, classroom: 304 },
                { day: 3, time: 5, classroom: 407 }
                ]
            }
        },
        {
            name: "Cálculo Numérico (NB)",
            professor: "Luis Felipe Bueno",
            classes: {
                create: [
                { day: 1, time: 6, classroom: 403 },
                { day: 3, time: 6, classroom: 407 }
                ]
            }
        },
        {
            name: "Séries e Equações Diferenciais Ordinárias (N)",
            professor: "Daniela Oliveira",
            classes: {
                create: [
                { day: 2, time: 5, classroom: 206 },
                { day: 4, time: 5, classroom: 206 }
                ]
            }
        },
        {
            name: "Cálculo em Uma Variável (N)(Reoff)",
            professor: "Daniela Oliveira",
            classes: {
                create: [
                { day: 1, time: 5, classroom: 210 },
                { day: 4, time: 5, classroom: 210 },
                { day: 5, time: 5, classroom: 210 },
                ]
            }
        },
        {
            name: "Circuitos Digitais (IA)",
            professor: "Fábio Cappabianco",
            classes: {
                create: [
                { day: 5, time: 1, classroom: 407 },
                { day: 5, time: 2, classroom: 407 }
                ]
            }
        },
        {
            name: "Fenômenos Mecânicos (N)",
            professor: "Ana Slapnik",
            classes: {
                create: [
                { day: 2, time: 5, classroom: 302 },
                { day: 4, time: 5, classroom: 302 }
                ]
            }
        },
        
        {
            name: "Introdução à Engenharia de Materiais (N)",
            professor: "Ana Albers",
            classes: {
                create: [
                { day: 1, time: 5, classroom: 306 }
                ]
            }
        },
        {
            name: "Álgebra Linear (NB)",
            professor: "Robson Oliveira",
            classes: {
                create: [
                { day: 2, time: 6, classroom: 301 },
                { day: 4, time: 6, classroom: 301 }
                ]
            }
        },
        {
            name: "Matemática Discreta (ID)",
            professor: "Grasiele Jorge",
            classes: {
                create: [
                { day: 1, time: 2, classroom: 302 },
                { day: 3, time: 2, classroom: 302 }
                ]
            }
        },
        {
            name: "Matemática Discreta (IC)",
            professor: "Erwin Doescher",
            classes: {
                create: [
                { day: 1, time: 2, classroom: 204 },
                { day: 3, time: 2, classroom: 204 }
                ]
            }
        },
        {
            name: "Algoritmos e Estruturas de Dados I (N)",
            professor: "Arlindo da Conceição",
            classes: {
                create: [
                { day: 1, time: 5, classroom: 307 },
                { day: 3, time: 5, classroom: 407 }
                ]
            }
        },
        {
            name: "Química Experimental",
            professor: "Walter White",
            classes: {
                create: [
                { day: 5, time: 3, classroom: 214 },
                { day: 5, time: 4, classroom: 214 }
                ]
            }
        }
    ]

    for (const s of subjects) {
        await prisma.subject.create({ data: s });
    }

    console.log("Database seeded successfully")
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });