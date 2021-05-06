// @ts-check

module.exports = {
  translation: {
    appName: 'TaskManager',
    entities: {
      user: {
        firstName: 'Имя',
        lastName: 'Фамилия',
        email: 'Email',
        password: 'Пароль',
      },
    },
    flash: {
      session: {
        create: {
          success: 'Вы залогинены',
          error: 'Неправильный емейл или пароль',
        },
        delete: {
          success: 'Вы разлогинены',
        },
      },
      users: {
        IDerror: 'Вы не можете редактировать или удалять другого пользователя',
        create: {
          error: 'Не удалось зарегистрировать',
          success: 'Пользователь успешно зарегистрирован',
        },
        edit: {
          error: 'Не удалось изменить',
          success: 'Пользователь успешно изменён',
        },
        delete: {
          error: 'Не удалось удалить пользователя',
          success: 'Пользователь успешно удалён',
        },
      },
      statuses: {
        create: {
          error: 'Не удалось создать',
          success: 'Статус успешно создан',
        },
        edit: {
          error: 'Не удалось изменить',
          success: 'Статус успешно изменён',
        },
        delete: {
          error: 'Не удалось удалить',
          success: 'Статус успешно удалён',
        },
      },
      labels: {
        create: {
          error: 'Не удалось создать',
          success: 'Метка успешно создана',
        },
        edit: {
          error: 'Не удалось изменить',
          success: 'Метка успешно изменена',
        },
        delete: {
          success: 'Метка успешно удалена',
        },
      },
      tasks: {
        create: {
          error: 'Не удалось создать',
          success: 'Задача успешно создана',
        },
        edit: {
          error: 'Не удалось изменить',
          success: 'Задача успешно изменена',
        },
        delete: {
          success: 'Задача успешно удалена',
        },
      },
      authError: 'Доступ запрещён! Пожалуйста, авторизируйтесь.',
    },
    layouts: {
      application: {
        users: 'Пользователи',
        statuses: 'Статусы',
        labels: 'Метки',
        tasks: 'Задачи',
        signIn: 'Вход',
        signUp: 'Регистрация',
        signOut: 'Выход',
      },
    },
    views: {
      session: {
        noAccount: 'Нет аккаунта?',
        registration: 'Зарегистрироваться.',
        new: {
          signIn: 'Вход',
          submit: 'Войти',
        },
      },
      users: {
        id: 'ID',
        fullName: 'Полное имя',
        createdAt: 'Дата создания',
        editLink: 'Изменить',
        deleteLink: 'Удалить',
        new: {
          submit: 'Сохранить',
          signUp: 'Регистрация',
        },
        edit: {
          submit: 'Изменить',
          header: 'Изменение пользователя',
        },
      },
      statuses: {
        id: 'ID',
        name: 'Наименование',
        createdAt: 'Дата создания',
        newLink: 'Создать статус',
        editLink: 'Изменить',
        deleteLink: 'Удалить',
        new: {
          header: 'Создание статуса',
          name: 'Наименование',
          submit: 'Создать',
        },
        edit: {
          submit: 'Изменить',
          name: 'Наименование',
          header: 'Изменение статуса',
        },
      },
      labels: {
        id: 'ID',
        name: 'Наименование',
        createdAt: 'Дата создания',
        newLink: 'Создать метку',
        editLink: 'Изменить',
        deleteLink: 'Удалить',
        new: {
          header: 'Создание метки',
          name: 'Наименование',
          submit: 'Создать',
        },
        edit: {
          submit: 'Изменить',
          name: 'Наименование',
          header: 'Изменение метки',
        },
      },
      tasks: {
        id: 'ID',
        name: 'Наименование',
        description: 'Описание',
        status: 'Статус',
        creator: 'Автор',
        owner: 'Исполнитель',
        createdAt: 'Дата создания',
        labels: 'Метки',
        newLink: 'Создать задачу',
        editLink: 'Изменить',
        deleteLink: 'Удалить',
        new: {
          header: 'Создание задачи',
          submit: 'Создать',
        },
        edit: {
          submit: 'Изменить',
          header: 'Изменение задачи',
        },
      },
      welcome: {
        hello: 'Здравствуйте',
        noTasks: 'У вас на исполнении нет задач. Так держать!',
        ownedTasks: 'У вас на исполнении следующие задачи',
        tasksLink: 'Смотреть все задачи',
      },
    },
  },
};
