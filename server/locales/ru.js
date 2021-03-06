// @ts-check

module.exports = {
  translation: {
    appName: 'TaskManager',
    entities: {
      label: {
        id: 'ID',
        name: 'Наименование',
        createdAt: 'Дата создания',
      },
      status: {
        id: 'ID',
        name: 'Наименование',
        createdAt: 'Дата создания',
      },
      user: {
        id: 'ID',
        firstName: 'Имя',
        lastName: 'Фамилия',
        email: 'Email',
        password: 'Пароль',
        createdAt: 'Дата создания',
      },
      task: {
        id: 'ID',
        name: 'Наименование',
        description: 'Описание',
        status: 'Статус',
        creator: 'Автор',
        executor: 'Исполнитель',
        labels: 'Метки',
        createdAt: 'Дата создания',
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
        accessError: 'Вы не можете редактировать или удалять другого пользователя',
        create: {
          error: 'Не удалось зарегистрировать',
          success: 'Пользователь успешно зарегистрирован',
        },
        edit: {
          success: 'Пользователь успешно изменён',
        },
        delete: {
          error: 'Не удалось удалить пользователя',
          success: 'Пользователь успешно удалён',
        },
      },
      statuses: {
        create: {
          success: 'Статус успешно создан',
          error: 'Не удалось создать статус',
        },
        edit: {
          success: 'Статус успешно изменён',
        },
        delete: {
          error: 'Не удалось удалить',
          success: 'Статус успешно удалён',
        },
      },
      labels: {
        create: {
          success: 'Метка успешно создана',
          error: 'Не удалось создать метку',
        },
        edit: {
          success: 'Метка успешно изменена',
        },
        delete: {
          error: 'Не удалось удалить',
          success: 'Метка успешно удалена',
        },
      },
      tasks: {
        accessError: 'Задачу может удалить только её автор',
        create: {
          success: 'Задача успешно создана',
          error: 'Не удалось создать задачу',
        },
        edit: {
          success: 'Задача успешно изменена',
        },
        delete: {
          success: 'Задача успешно удалена',
        },
      },
      editError: 'Не удалось изменить',
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
      edit: 'Изменить',
      delete: 'Удалить',
      create: 'Создать',
      session: {
        noAccount: 'Нет аккаунта?',
        registration: 'Зарегистрироваться.',
        new: {
          signIn: 'Вход',
          submit: 'Войти',
        },
      },
      users: {
        fullName: 'Полное имя',
        new: {
          signUp: 'Регистрация',
          submit: 'Сохранить',
        },
        edit: {
          header: 'Изменение пользователя',
        },
      },
      statuses: {
        newLink: 'Создать статус',
        new: {
          header: 'Создание статуса',
        },
        edit: {
          header: 'Изменение статуса',
        },
      },
      labels: {
        newLink: 'Создать метку',
        new: {
          header: 'Создание метки',
        },
        edit: {
          header: 'Изменение метки',
        },
      },
      tasks: {
        newLink: 'Создать задачу',
        showFiltered: 'Показать',
        clearFilters: 'Сбросить',
        label: 'Метка',
        myTasks: 'Только мои задачи',
        new: {
          header: 'Создание задачи',
        },
        edit: {
          header: 'Изменение задачи',
        },
      },
      welcome: {
        hello: 'Здравствуйте',
        authed: {
          text: 'Вы вошли в систему',
          tasksLink: 'Смотреть задачи',
        },
        unauthed: {
          text: 'Вы не вошли в систему',
          logInLink: 'Войдите',
          or: 'или',
          signUpLink: 'зарегистрируйтесь',
        },
        tasksLink: 'Смотреть все задачи',
      },
    },
  },
};
