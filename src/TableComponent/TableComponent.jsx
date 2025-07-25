import { useState } from "react";
import { Table, Modal, Button, Form, Input, DatePicker } from "antd";
import dayjs from "dayjs";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import "./styles.css";

const TableComponent = () => {
  const initialData = [
    { key: 1, name: "Алексей", date: "2023-01-01", value: 100 },
    { key: 2, name: "Мария", date: "2023-02-15", value: 200 },
    { key: 3, name: "Иван", date: "2023-03-10", value: 150 },
    { key: 4, name: "Екатерина", date: "2023-04-20", value: 175 },
    { key: 5, name: "Дмитрий", date: "2023-05-05", value: 300 },
    { key: 6, name: "Наталья", date: "2023-06-01", value: 250 },
    { key: 7, name: "Сергей", date: "2023-07-18", value: 90 },
    { key: 8, name: "Олег", date: "2023-08-22", value: 320 },
    { key: 9, name: "Анна", date: "2023-09-12", value: 115 },
    { key: 10, name: "Светлана", date: "2023-10-05", value: 210 },
  ];

  const [data, setData] = useState(initialData); // Состояние для хранения данных таблицы
  const [isModalVisible, setIsModalVisible] = useState(false); // Состояние для управления видимостью модального окна
  const [isEditing, setIsEditing] = useState(false); // Состояние для определения, редактируется ли запись
  const [currentRecord, setCurrentRecord] = useState(null); // Хранение текущей записи, которую редактируем
  const [searchText, setSearchText] = useState(""); // Состояние для хранения текста поиска
  const [form] = Form.useForm(); // Создаем экземпляр формы Ant Design
  const dateFormat = "DD.MM.YYYY";
  // Функция для отображения модального окна
  const showModal = () => {
    setIsModalVisible(true);
    setIsEditing(false); // Устанавливаем режим добавления
    setCurrentRecord(null); // Сбрасываем текущую запись
    form.resetFields(); // Сбрасываем поля формы
  };

  // Функция для обработки редактирования записи
  const handleEdit = (record) => {
    setIsModalVisible(true); // Показываем модальное окно
    setIsEditing(true); // Устанавливаем режим редактирования
    setCurrentRecord(record); // Устанавливаем текущую запись
    // Устанавливаем значения полей формы на основе текущей записи
    form.setFieldsValue({
      name: record.name,
      date: dayjs(record.date), // Преобразуем дату
      value: record.value,
    });
  };

  // Функция для удаления записи
  const handleDelete = (key) => {
    setData(data.filter((item) => item.key !== key)); // Удаляем запись по ключу
  };

  // Функция для обработки сохранения
  const handleOk = (values) => {
    if (isEditing && currentRecord) {
      // Если редактирование, обновляем запись
      setData(
        data.map((item) =>
          item.key === currentRecord.key
            ? { ...item, ...values, date: values.date.toISOString() }
            : item
        )
      );
    } else {
      // Если добавление новой записи
      setData([
        ...data,
        { ...values, key: Date.now(), date: values.date.toISOString() }, // Генерируем уникальный ключ
      ]);
    }
    setIsModalVisible(false); // Закрываем модальное окно
    form.resetFields(); // Сбрасываем поля формы
  };

  // Функция для отмены
  const handleCancel = () => {
    setIsModalVisible(false); // Закрываем модальное окно
    form.resetFields(); // Сбрасываем поля формы
  };

  // Функция для обработки поиска
  const handleSearch = (event) => {
    setSearchText(event.target.value); // Сохраняем текст поиска
  };

  // Фильтрация данных на основе текста поиска
  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  // Определяем колонки для таблицы
  const columns = [
    {
      title: "Имя",
      dataIndex: "name",
      width: 350,
      sorter: (a, b) => a.name.localeCompare(b.name), // Сортировка по имени (строка)
    },
    {
      title: "Дата",
      dataIndex: "date",
      width: 250,
      // Форматируем дату для отображения
      render: (text) => dayjs(text).format(dateFormat),
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(), // Сортировка по дате
    },
    {
      title: "Числовое значение",
      dataIndex: "value",
      width: 250,
      sorter: (a, b) => a.value - b.value, // Сортировка по числовому значению
    },
    {
      title: "Действия",
      width: 150,
      render: (record) => (
        <>
          <EditOutlined
            onClick={() => {
              handleEdit(record);
            }}
            style={{ marginLeft: 15 }}
          />

          <DeleteOutlined
            onClick={() => {
              handleDelete(record.key);
              // showDeleteConfirm(record);
            }}
            style={{ color: "red", marginLeft: 15 }}
          />
        </>
      ),
    },
  ];

  return (
    <div className="container">
      <div className="control">
        <Input
          placeholder="Поиск..." // Подсказка для поля поиска
          value={searchText}
          onChange={handleSearch} // Обработка события изменения текста
          style={{
            width: 400,
          }} // Стили для поля
        />
        <Button onClick={showModal} type="primary">
          Добавить
        </Button>
      </div>
      <Table columns={columns} dataSource={filteredData} />{" "}
      {/* Отображаем таблицу с данными */}
      <Modal
        title={isEditing ? "Редактирование" : "Добавление"} // Заголовок модального окна в зависимости от режима
        open={isModalVisible} // Управление видимостью модального окна
        onCancel={handleCancel} // Обработка отмены
        footer={null} // Без кнопок в нижней части модального окна
      >
        <Form form={form} onFinish={handleOk}>
          {" "}
          {/* Форма для ввода данных */}
          <Form.Item
            name="name"
            label="Имя"
            rules={[{ required: true, message: "Введите имя!" }]} // Правило для обязательного поля
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="date"
            label="Дата"
            rules={[{ required: true, message: "Выберите дату!" }]} // Правило для обязательного поля
          >
            <DatePicker format={dateFormat} />
          </Form.Item>
          <Form.Item
            name="value"
            label="Числовое значение"
            rules={[{ required: true, message: "Введите значение!" }]} // Правило для обязательного поля
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginLeft: "auto", display: "block" }}
            >
              {" "}
              {isEditing ? "Сохранить" : "Добавить"}{" "}
              {/* Кнопка отправки формы */}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TableComponent;
