const rateLimitMap = new Map<string, { count: number; date: string }>()

function getToday() {
    return new Date().toISOString().split("T")[0]
}


// OpenRouter
// export async function POST(req: Request) {
//     const ip = req.headers.get("x-forwarded-for") || "unknown";
//     const { input } = await req.json();

//     const today = getToday();
//     const userData = rateLimitMap.get(ip);

//     if (userData) {
//         if (userData.date === today) {
//             if (userData.count >= 3) {
//                 return Response.json({
//                     result: "Batas penggunaan harian telah tercapai (maks 3x). Coba lagi besok."
//                 });
//             }

//             userData.count += 1;
//         } else {

//             rateLimitMap.set(ip, { count: 1, date: today });
//         }
//     } else {
//         rateLimitMap.set(ip, { count: 1, date: today });
//     }

//     const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//         method: "POST",
//         headers: {
//             "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//             model: "google/gemma-3-27b-it:free",
//             messages: [
//                 {
//                     role: "user",
//                     content: `Kamu adalah AI career assistant.

//                     Buat roadmap belajar untuk: ${input}.
//                     Sertakan:
//                         1. Skill yang harus dipelajari
//                         2. Langkah belajar bertahap
//                         3. Contoh project

//                     Jawab dengan rapi dan mudah dibaca.`
//                 }
//             ]
//         })
//     });

//     const data = await response.json();

//     console.log(data);

//     return Response.json({
//         result: data.choices?[0]?.message?.content || "Tidak ada hasil"
//     });
// }


// Gemini 
export async function POST(req: Request) {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const { input } = await req.json();

    const today = getToday();
    const userData = rateLimitMap.get(ip);

    if (userData) {
        if (userData.date === today) {
            if (userData.count >= 3) {
                return Response.json({
                    result: "Batas penggunaan harian telah tercapai (maks 3x). Coba lagi besok."
                });
            }

            userData.count += 1;
        } else {
            rateLimitMap.set(ip, { count: 1, date: today });
        }
    } else {
        rateLimitMap.set(ip, { count: 1, date: today });
    }

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: `You are Aiko, a friendly and supportive AI career mentor.

                                You help users plan their learning journey in a clear and structured way.

                                User goal: ${input}

                                Provide:
                                - Skills to learn
                                - Step-by-step roadmap
                                - Example projects

                                Use a friendly and encouraging tone. You don't need to provide further questions or explanations—just answer them in a single reply. Tailor the roadmap for beginners with no prior experience. If a question is irrelevant, you can simply reply briefly that it's off-topic.`,
                            },
                        ],
                    },
                ],
            }),
        }
    );

    const data = await response.json();

    // console.log(data);

    return Response.json({
        result:
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No results",
    });
}