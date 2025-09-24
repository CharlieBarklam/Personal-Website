export default async function handler(req, res) {

    try {
        // check if request is coming from correct URL
        // const origin = req.headers.origin || "";
        // const allowed = process.env.PUBLIC_SITE_ORIGIN;
        // if (allowed && origin && origin !== allowed) {
        //     return res.status(403).json({ error: "Forbidden" });
        // }
        
        // retrieve key
        const api_key = process.env.WEATHERSTACK_KEY;
        if (!key) return res.status(500).json({ error: "Server misconfigured (no key)" });
        
        // build target URL for API request
        const { path = [] } = req.query;
        const endpoint = path.join("/") || "current";
        const qs = new URLSearchParams(req.query);
        qs.delete("path");
        if (!qs.get("access_key")) qs.set("access_key", key);

        const base = "http://api.weatherstack.com";
        const url  = `${base}/${endpoint}?${qs.toString()}`

        const upstream = fetch(url);
        const data = await upstream.json();

        // cache result
        res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate=300");
        
        return res.status(upstream.status).json(data);
    } catch (err) {
        return res.status(502).json({ error: "Upstream failed", detail: String(err) });
    }

}