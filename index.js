const prompt = require("prompt-sync")({ sigint: true });

let end = 0;
let bastkets = [
	{
		number: 1,
		contents: [
			{ amount: 1, item: "Jumper", cost: 54.65, category: null },
			{ amount: 1, item: "Head Light", cost: 3.5, category: "Head Gear" },
			{
				amount: 1,
				item: "£10 Gift Voucher",
				cost: 10,
				category: "Gift",
			},
		],
		vouchers: [],
	},
	{
		number: 2,
		contents: [
			{ amount: 1, item: "Gloves", cost: 10.5, category: null },
			{ amount: 1, item: "Jumper", cost: 54.65, category: null },
		],
		vouchers: [{ type: "Gift", amount: 5, number: "XXX-XXX" }],
	},
	{
		number: 3,
		contents: [
			{ amount: 1, item: "Gloves", cost: 25, category: null },
			{ amount: 1, item: "Jumper", cost: 26, category: null },
		],
		vouchers: [
			{
				type: "Offer",
				category: "Head Gear",
				amount: 5,
				minimumSpend: 50,
				number: "YYY-YYY",
			},
		],
	},
	{
		number: 4,
		contents: [
			{ amount: 1, item: "Gloves", cost: 25, category: null },
			{ amount: 1, item: "Jumper", cost: 26, category: null },
			{ amount: 1, item: "Head Light", cost: 3.5, category: "Head Gear" },
			{
				amount: 1,
				item: "£10 Gift Voucher",
				cost: 10,
				category: "Gift",
			},
		],
		vouchers: [
			{
				type: "Offer",
				category: "Head Gear",
				amount: 5,
				minimumSpend: 50,
				number: "YYY-YYY",
			},
		],
	},
	{
		number: 5,
		contents: [
			{ amount: 1, item: "Gloves", cost: 25, category: null },
			{ amount: 1, item: "Jumper", cost: 26, category: null },
		],
		vouchers: [
			{ type: "Gift", amount: 5, number: "XXX-XXX" },
			{
				type: "Offer",
				amount: 5,
				minimumSpend: 50,
				number: "YYY-YYY",
			},
		],
	},
	{
		number: 6,
		contents: [
			{ amount: 1, item: "Gloves", cost: 25, category: null },
			{
				amount: 1,
				item: "£30 Gift Voucher",
				cost: 30,
				category: "Gift",
			},
		],
		vouchers: [
			{
				type: "Offer",
				amount: 5,
				minimumSpend: 50,
				number: "YYY-YYY",
			},
		],
	},
	{
		number: 7,
		contents: [{ amount: 1, item: "Gloves", cost: 25, category: null }],
		vouchers: [
			{
				type: "Gift",
				amount: 30,
				number: "XXX-XXX",
			},
		],
	},
];
while (end == 0) {
	const basketNumber = prompt("Select test basket to run 1-7, or 0 to exit: ");
	if (isNaN(basketNumber) || basketNumber > 7 || basketNumber < 0) {
		console.log(`${basketNumber} is not a valid entry`);
	} else if (basketNumber == 0) {
		console.log("Exiting...");
		end = 1;
	} else if (basketNumber <= 7 && basketNumber > 0) {
		console.log(`Basket ${basketNumber}:`);

		let basket = bastkets.find((basket) => basket.number == basketNumber);
		let costToString;
		let subtotal = 0;
		let categoryTotal = [
			{ type: null, total: 0 },
			{ type: "Gift", total: 0 },
		];
		let giftVoucherTotal = 0;
		let offerVoucher = {};

		for (let i = 0; i < basket.contents.length; i++) {
			if (
				basket.contents[i].cost.toString().length == 1 ||
				basket.contents[i].cost.toString().length == 2
			) {
				costToString = basket.contents[i].cost.toString() + ".00";
			} else if (
				basket.contents[i].cost.toString().length == 3 ||
				basket.contents[i].cost.toString().length == 4
			) {
				costToString = basket.contents[i].cost.toString() + "0";
			} else {
				costToString = basket.contents[i].cost;
			}
			console.log(
				basket.contents[i].amount +
					" " +
					basket.contents[i].item +
					" @ £" +
					costToString
			);
			console.log();

			let index = categoryTotal.findIndex(
				(x) => x.type == basket.contents[i].category
			);

			if (index === -1) {
				categoryTotal.push({
					type: basket.contents[i].category,
					total: basket.contents[i].cost,
				});
			} else {
				categoryTotal[index].total += basket.contents[i].cost;
			}

			subtotal += basket.contents[i].cost;
		}

		console.log("Sub Total: £" + subtotal);
		console.log();

		for (let i = 0; i < basket.vouchers.length; i++) {
			if (basket.vouchers[i].type == "Gift") {
				giftVoucherTotal += basket.vouchers[i].amount;
			} else if (basket.vouchers[i].type == "Offer") {
				if (
					basket.vouchers[i].minimumSpend <=
					subtotal - categoryTotal[1].total
				) {
					console.log("voucher meets minspend");
					if (basket.vouchers[i].category) {
						let index = categoryTotal.findIndex(
							(x) => x.type == basket.vouchers[i].category
						);
						if (index == -1) {
							console.log(
								"There are no products in your basket applicable to Offer Voucher YYY-YYY."
							);
						} else {
							if (
								Object.keys(offerVoucher).length === 0 ||
								offerVoucher.amount < basket.vouchers[i].amount
							) {
								offerVoucher = basket.vouchers[i];
							}
						}
					} else {
						if (
							Object.keys(offerVoucher).length === 0 ||
							offerVoucher.amount < basket.vouchers[i].amount
						) {
							offerVoucher = basket.vouchers[i];
						}
					}
				} else {
					console.log("did not meet minspend");
				}
			}
		}

		if (offerVoucher.amount > 0) {
			let index = categoryTotal.findIndex(
				(x) => x.type == offerVoucher.category
			);

			if (index == -1) {
				categoryTotal[0].total =
					(categoryTotal[0].total * 10 - offerVoucher.amount * 10) / 10;
			} else {
				categoryTotal[index].total =
					(categoryTotal[index].total * 10 - offerVoucher.amount * 10) / 10;
			}

			if (categoryTotal[index].total < 0) {
				categoryTotal[index].total = 0;
			}
		}

		if (giftVoucherTotal > 0) {
			for (let i = 0; i < categoryTotal.length; i++) {
				if (categoryTotal[i].type != "Gift") {
					categoryTotal[i].total =
						(categoryTotal[i].total * 10 - giftVoucherTotal * 10) / 10;
					if (categoryTotal[i].total < 0) {
						giftVoucherTotal = categoryTotal[i].total * -1;
						categoryTotal[i].total = 0;
					}
				}
			}

			console.log("1 x " + "£5.00 Gift Voucher XXX-XXX applied");
		}

		if (Object.keys(offerVoucher).length === 0 && giftVoucherTotal == 0) {
			console.log("No vouchers applied");
		}

		subtotal = 0;

		for (let i = 0; i < categoryTotal.length; i++) {
			subtotal += categoryTotal[i].total;
		}

		console.log("Total: £" + subtotal);
	}
}
