import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type_code = searchParams.get("type");
  const days = searchParams.get("days");

  // Xây dựng URL gốc gọi đến vang.today
  let url = "https://www.vang.today/api/prices";
  const params = new URLSearchParams();
  if (type_code) params.append("type", type_code);
  if (days) params.append("days", days);

  const queryString = params.toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  try {
    const response = await fetch(url, {
      next: { revalidate: 60 }, // Cache response for 60 seconds to avoid spamming the external API
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`External API failed with status ${response.status}`);
    }

    const data = await response.json();

    // The vang.today API actually returns an object of prices, but our UI expects an array in `data`
    let formattedData: Record<string, unknown>[] = [];
    if (data && data.prices) {
      formattedData = Object.entries(data.prices).map(([code, details]) => ({
        type_code: code,
        ...(details as Record<string, unknown>),
      }));
    } else if (data && data.data) {
      formattedData = data.data; // fallback if it ever changes back
    }

    // Thêm CORS headers vì api có thể được gọi từ các zone MFE khác nếu cần
    return NextResponse.json(
      { success: true, data: formattedData },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("vang.today API proxy error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch gold prices" },
      { status: 500 },
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    },
  );
}
