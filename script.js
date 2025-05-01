let player = JSON.parse(localStorage.getItem("player")) || {
  name: "",
  hp: 100,
  maxHp: 100,
  gold: 100,
  inventory: [],
  class: "",
  level: 1,
};

const output = document.getElementById("game-output");

function save() {
  localStorage.setItem("player", JSON.stringify(player));
}

function log(text) {
  output.innerHTML += text + "<br>";
  output.scrollTop = output.scrollHeight;
}

function handleCommand() {
  const input = document.getElementById("user-input");
  const cmd = input.value.trim().toLowerCase();
  input.value = "";

  if (!player.name) {
    player.name = cmd;
    log(`Добро пожаловать, ${player.name}! Введите команду: класс (воин/маг/лучник)`);
    save();
    return;
  }

  if (!player.class) {
    if (["воин", "маг", "лучник"].includes(cmd)) {
      player.class = cmd;
      log(`Вы выбрали класс: ${player.class} ⚔️`);
    } else {
      log("Выберите класс: воин, маг или лучник");
      return;
    }
    save();
    return;
  }

  switch (cmd) {
    case "статус":
      log(`👤 ${player.name} | ❤️ ${player.hp}/${player.maxHp} | 💰 ${player.gold} | 🧪 Уровень: ${player.level}`);
      break;

    case "бой":
      let mob = { name: "Дракон 🐉", hp: 50 + player.level * 10 };
      let dmg = 10 + player.level * 2;
      mob.hp -= dmg;
      player.hp -= 15;
      if (player.hp <= 0) {
        log("☠️ Вы проиграли бой и потеряли часть золота.");
        player.hp = player.maxHp;
        player.gold = Math.max(0, player.gold - 20);
      } else {
        log(`Вы победили ${mob.name} и получили 50 золота!`);
        player.gold += 50;
        player.level += 1;
      }
      save();
      break;

    case "инвентарь":
      log(`🎒 Инвентарь: ${player.inventory.length ? player.inventory.join(", ") : "пусто"}`);
      break;

    case "магазин":
      log("🛒 Магазин: меч - 50 золота, зелье - 30 золота");
      break;

    case "купить меч":
      if (player.gold >= 50) {
        player.gold -= 50;
        player.inventory.push("меч 🗡️");
        log("Вы купили меч!");
      } else log("Недостаточно золота.");
      save();
      break;

    case "купить зелье":
      if (player.gold >= 30) {
        player.gold -= 30;
        player.inventory.push("зелье 🧪");
        log("Вы купили зелье!");
      } else log("Недостаточно золота.");
      save();
      break;

    case "использовать зелье":
      if (player.inventory.includes("зелье 🧪")) {
        player.hp = Math.min(player.maxHp, player.hp + 30);
        player.inventory.splice(player.inventory.indexOf("зелье 🧪"), 1);
        log("Вы использовали зелье и восстановили здоровье.");
      } else log("У вас нет зелья.");
      save();
      break;

    case "сброс":
      localStorage.clear();
      location.reload();
      break;

    default:
      log("Неизвестная команда.");
  }
}
