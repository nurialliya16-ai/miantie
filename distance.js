async function hitungJarak() { //async ---> proses menghitung jarak
    const alamat = document.getElementById("alamat").value;
    if (!alamat) {
        alert("Masukkan alamat terlebih dahulu!");
        return;
    }

    // Tampilkan loading
    document.getElementById("hasil").innerText = "Loading...";

    // Lokasi toko miantie.id (ambil dari Google Maps)
    const toko = { lat: -7.6553954, lng: 112.8974542 };

    try {
        // 1. Geocoding alamat customer -> koordinat
        const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(alamat)}`;

        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();

        if (!geoData.length) {
            document.getElementById("hasil").innerText = "Alamat tidak ditemukan!";
            return;
        }

        const custLat = geoData[0].lat;
        const custLon = geoData[0].lon;

        // 2. Hitung jarak menggunakan OSRM (driving route)
        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${custLon},${custLat};${toko.lng},${toko.lat}?overview=false`;

        const osrmRes = await fetch(osrmUrl);
        const osrmData = await osrmRes.json();

        if (!osrmData.routes || !osrmData.routes.length) {
            document.getElementById("hasil").innerText = "Gagal menghitung jarak!";
            return;
        }

        const distanceMeters = osrmData.routes[0].distance;
        const durationSeconds = osrmData.routes[0].duration;

        const distanceKm = (distanceMeters / 1000).toFixed(2);
        const durationMinutes = Math.round(durationSeconds / 60);
        
        // Konversi waktu: menit → jam/menit
        let waktuDisplay = "";

        if (durationMinutes >= 60) {
            const hours = Math.floor(durationMinutes / 60);
            const minutes = durationMinutes % 60;
            waktuDisplay = `${hours} jam ${minutes} menit`;
        } else {
            waktuDisplay = `${durationMinutes} menit`;
        }

        document.getElementById("hasil").innerHTML = `
            <b>Jarak:</b> ${distanceKm} km<br>
            <b>Estimasi waktu:</b> ${waktuDisplay}
        `;

    } catch (err) {
        document.getElementById("hasil").innerText = "Terjadi kesalahan: " + err;
    }
}