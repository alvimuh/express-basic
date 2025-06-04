const count = (x) => {
  if (x > 3) {
    return "failed";
  }
  return "success";
};

const countDown = (x) => {
  return new Promise((resolve, reject) => {
    if (x < 1) {
      reject("Delay tidak boleh kurang dari 1");
    }
    setTimeout(() => {
      resolve("Delay selama " + x + " detik");
    }, x * 1000);
  });
};

async function main() {
  try {
    const hasilCountDown = await countDown(1);
    console.log("hasilCountDown : " + hasilCountDown);
    const hasilCountDown2 = await countDown(1);
    console.log("hasilCountDown : " + hasilCountDown2);
    const hasilCountDown3 = await countDown(1);
    console.log("hasilCountDown : " + hasilCountDown3);
    const hasilCountDown4 = await countDown(1);
    console.log("hasilCountDown : " + hasilCountDown4);
  } catch (error) {
    console.log("Catch : " + error);
  }
}

main();
