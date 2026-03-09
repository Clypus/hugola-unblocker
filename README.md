# Hugola Unblock

🔓 Türkiye'de engellenen YouTube kanallarını VPN'siz görüntülemeyi sağlayan tarayıcı eklentisi.

## Ne İşe Yarar?

Türkiye'de bazı YouTube kanalları erişim engeline alınmıştır. Bu eklenti, YouTube'un InnerTube Browse API'sine yapılan isteklerdeki coğrafi konum parametresini değiştirerek engeli aşar — **VPN gerekmez**.

## Nasıl Çalışır?

Eklenti 5 katmanlı bir bypass mekanizması kullanır:

1. **Fetch/XHR Patching** — YouTube'un API isteklerindeki `gl` (ülke) parametresini değiştirir
2. **ytcfg Override** — YouTube'un istemci yapılandırmasındaki ülke kodunu günceller
3. **ytInitialData Interception** — Sunucudan gelen engel bildirimlerini temizler
4. **Browse API Injection** — Kendi API çağrısını yaparak kanal verisini sayfaya enjekte eder
5. **Navigation Guard** — YouTube'un hata sayfasına yönlendirmesini engeller

## Kurulum

### Chrome / Edge / Brave
1. `chrome://extensions` adresine gidin
2. "Geliştirici modu"nu açın
3. "Paketlenmemiş yükle" → bu klasörü seçin

### Firefox
1. `about:debugging#/runtime/this-firefox` adresine gidin
2. "Geçici Eklenti Yükle" → `manifest.json` dosyasını seçin

### Mağazadan (yakında)
- Chrome Web Store: *yakında*
- Firefox Add-ons: *yakında*

## Desteklenen Kanallar

| Kanal | Channel ID |
|-------|-----------|
| HUGOLA | `UC6F8_4OLIQ9bkurVgdcLAeQ` |

Yeni kanal eklemek için `inject.js` içindeki `TRACKED_CHANNELS` objesine kanal handle'ını ve ID'sini ekleyin.

## Dosya Yapısı

```
├── manifest.json    # Eklenti tanımı (Manifest V3, Chrome + Firefox)
├── inject.js        # Ana bypass script (sayfa kontekstinde çalışır)
├── rules.json       # declarativeNetRequest redirect kuralları
└── icons/           # Eklenti ikonları
```

## Katkıda Bulunma

1. Fork yapın
2. Yeni bir branch oluşturun (`git checkout -b feature/yeni-kanal`)
3. Değişikliklerinizi commit edin
4. Pull request açın

### Yeni Kanal Ekleme

`inject.js` içindeki `TRACKED_CHANNELS` objesine ekleyin:

```javascript
const TRACKED_CHANNELS = {
  'kanalhandle': 'UCxxxxxxxxxxxxxxxxxxxxxxxxx',
  // ...
};
```

## Lisans

MIT License — detaylar için [LICENSE](LICENSE) dosyasına bakın.

## ⚠️ Sorumluluk Reddi

Bu eklenti yalnızca eğitim ve kişisel kullanım amaçlıdır. YouTube'un Hizmet Şartlarını ihlal etme sorumluluğu kullanıcıya aittir.
