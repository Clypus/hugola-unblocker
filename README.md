# Hugola Unblock

🔓 Türkiye'de erişim engeli bulunan **Hugola** YouTube kanalını VPN'siz görüntülemeyi sağlayan tarayıcı eklentisi.

## Ne İşe Yarar?

Hugola YouTube kanalı Türkiye'de erişim engeliyle kısıtlanmıştır. Bu eklenti, YouTube'un InnerTube API'sindeki coğrafi konum parametresini değiştirerek engeli aşar — **VPN gerekmez**.

## Performans

Eklenti **sadece Hugola kanalı sayfalarında** aktif olur. Diğer YouTube sayfalarında hiçbir işlem yapmaz, tarayıcınızı yavaşlatmaz.

## Nasıl Çalışır?

1. **Fetch/XHR Patching** — API isteklerindeki `gl` parametresini değiştirir
2. **ytInitialData Interception** — Sunucudan gelen engel bildirimlerini temizler
3. **Browse API Injection** — Kendi API çağrısıyla kanal verisini sayfaya enjekte eder
4. **Navigation Guard** — YouTube'un hata sayfasına yönlendirmesini engeller
5. **URL Redirect** — `/hugolaa` adresini doğru kanal sayfasına yönlendirir

## Kurulum

### Chrome / Edge / Brave
1. `chrome://extensions` adresine gidin
2. **Geliştirici modu**'nu açın
3. **Paketlenmemiş yükle** → bu klasörü seçin

### Firefox
1. `about:debugging#/runtime/this-firefox` adresine gidin
2. **Geçici Eklenti Yükle** → `manifest.json` dosyasını seçin

## Lisans

MIT — detaylar için [LICENSE](LICENSE) dosyasına bakın.

## ⚠️ Sorumluluk Reddi

Bu eklenti yalnızca eğitim ve kişisel kullanım amaçlıdır.
