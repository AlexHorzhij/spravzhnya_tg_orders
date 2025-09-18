import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import "./App.css";
import type { TelegramUser } from "./types/telegram";

function App() {
  const [formData, setFormData] = useState({
    establishment: "",
    order: "",
    comment: "",
  });
  console.log("formData: ", formData.establishment);
  const [loading, setLoading] = useState(true);

  const [tgUser, setTgUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    // Перевіряємо наявність Telegram Web App
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;

      console.log("Telegram WebApp ініціалізовано");

      // Розширюємо міні-додаток на весь екран
      tg.expand();

      // Приховуємо стандартну кнопку (використовуємо свою)
      tg.MainButton.hide();

      // Отримуємо дані користувача
      const user = tg.initDataUnsafe?.user;
      console.log("Telegram User:", user);
      setTgUser(user || null);

      // // // Спосіб 1: Отримуємо дані з URL параметрів (якщо передаються з бота)
      // const urlParams = new URLSearchParams(window.location.search);
      // console.log("urlParams: ", urlParams);
      // const establishmentFromUrl = urlParams.get("establishment");
      // console.log("establishmentFromUrl: ", establishmentFromUrl);
      // const orderFromUrl = urlParams.get("order");
      // console.log("orderFromUrl: ", orderFromUrl);
      // const userIdFromUrl = urlParams.get("user_id");
      // console.log("userIdFromUrl: ", userIdFromUrl);

      // if (establishmentFromUrl || orderFromUrl) {
      //   setFormData((prev) => ({
      //     ...prev,
      //     establishment: establishmentFromUrl || prev.establishment,
      //     order: orderFromUrl || prev.order,
      //   }));
      // }

      // Спосіб 2: Якщо є user ID, можна отримати додаткові дані з API
      const userId = user?.id;
      console.log("userId: ", userId);
      if (userId) {
        fetchUserDataFromAPI(userId);
      }

      setLoading(false);
    } else {
      console.log("Telegram WebApp недоступний - тестування в браузері");
      setLoading(false);
    }
  }, []);

  // Функція для отримання даних користувача з твоєї бази через Make.com або API
  const fetchUserDataFromAPI = async (telegramUserId: string | number) => {
    try {
      // Приклад запиту до Make.com webhook
      const response = await fetch(
        `https://hook.eu2.make.com/len9lty3ig6ugp97uwzbe55bvvsfdpcf?telegram_id=${telegramUserId}`
      );

      if (response.ok) {
        const userData = await response.json();
        console.log("Отримані дані користувача:", userData);

        // Заповнюємо форму даними з таблиці
        setFormData((prev) => ({
          ...prev,
          establishment: userData[0].company || prev.establishment,
          // інші дані з таблиці
        }));
      }
    } catch (error) {
      console.error("Помилка отримання даних користувача:", error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const tg = window.Telegram?.WebApp;

    // Валідація
    if (!formData.establishment.trim()) {
      alert("Будь ласка, вкажіть заклад");
      return;
    }

    if (!formData.order.trim()) {
      alert("Будь ласка, опишіть замовлення");
      return;
    }

    try {
      // Формуємо дані для відправки
      const orderData = {
        establishment: formData.establishment,
        order: formData.order,
        comment: formData.comment,
        telegramUserId: tgUser?.id,
        userName: tgUser
          ? `${tgUser.first_name}${
              tgUser.last_name ? " " + tgUser.last_name : ""
            }`
          : "Невідомий",
        username: tgUser?.username || "",
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString("uk-UA"),
        time: new Date().toLocaleTimeString("uk-UA"),
      };

      console.log("Відправляємо замовлення:", orderData);

      // Відправка до Make.com або твого API
      const response = await fetch(
        "https://hook.eu1.make.com/YOUR_ORDER_WEBHOOK_ID",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      if (response.ok) {
        // Успішна відправка
        if (tg) {
          tg.showAlert("Замовлення успішно відправлено! Дякуємо!", () => {
            tg.close();
          });
        } else {
          alert("Замовлення успішно відправлено!");
          // Очищення форми для тестування
          setFormData({
            establishment: "",
            order: "",
            comment: "",
          });
        }
      } else {
        throw new Error("Помилка відправки на сервер");
      }
    } catch (error) {
      console.error("Помилка відправки замовлення:", error);

      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.showAlert(
          "Помилка відправки замовлення. Спробуйте ще раз."
        );
      } else {
        alert("Помилка відправки замовлення. Спробуйте ще раз.");
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>Завантаження...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, maxWidth: "100%" }}>
      {/* Привітання користувача */}
      {tgUser && (
        <Box sx={{ mb: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
          <Typography variant="h6">Вітаємо, {tgUser.first_name}! 👋</Typography>
          {tgUser.username && (
            <Typography variant="body2" color="text.secondary">
              @{tgUser.username}
            </Typography>
          )}
        </Box>
      )}

      <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
        Оформлення замовлення
      </Typography>

      <Box
        component="form"
        id="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          width: "100%",
        }}
      >
        <TextField
          name="establishment"
          label="Заклад"
          disabled
          variant="outlined"
          value={formData.establishment}
          onChange={handleInputChange}
          placeholder="Назва закладу або адреса"
          required
          sx={{ width: "100%" }}
        />

        <TextField
          name="order"
          multiline
          label="Замовлення"
          variant="outlined"
          rows={5}
          value={formData.order}
          onChange={handleInputChange}
          placeholder="Опишіть детально ваше замовлення..."
          required
          sx={{ width: "100%" }}
        />

        <TextField
          name="comment"
          multiline
          label="Коментар"
          variant="outlined"
          rows={4}
          value={formData.comment}
          onChange={handleInputChange}
          placeholder="Додаткові побажання або коментарі..."
          sx={{ width: "100%" }}
        />

        <Button
          size="large"
          type="submit"
          variant="contained"
          sx={{
            py: 1.5,
            fontSize: "1.1rem",
            fontWeight: "bold",
          }}
        >
          📦 Підтвердити замовлення
        </Button>
      </Box>

      {/* Інформація для тестування */}
      {!window.Telegram?.WebApp && (
        <Box sx={{ mt: 3, p: 2, bgcolor: "#fff3cd", borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            ⚠️ Тестовий режим - Telegram WebApp недоступний
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default App;
