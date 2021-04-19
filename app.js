

var budgetController = (function(){

	let allIncomes = [];
	let allExpenses = [];
	let totalExpenses = 0;

	let incomes = function(id,description,value){
		this.id = id;
		this.description = description;
		this.value = value;
	}

	let expenses = function(id,description,value){
		this.id = id;
		this.description = description;
		this.value = value;
	}

	let calculateTotal = function(type){
		let sum = 0;
		data.allItems[type].forEach((item)=>{
			sum += item.value;
		});
		data.totals[type] = sum;
	}


	let data={
		allItems:{
			inc:[],
			exp:[]
		},
		totals:{
			inc:0,
			exp:0
		},
		budget:0,
		percentage:-1
	}

	return {
		addItem:function(type,desc,value){
			var newItem,ID;

			ID = data.allItems[type].length > 0 ? data.allItems[type][data.allItems[type].length-1].id+1 : 0;
			if(type === 'inc'){
				newItem = new incomes(ID,desc,value);
			}else if(type === 'exp'){
				newItem = new expenses(ID,desc,value);
			}

			data.allItems[type].push(newItem);
			return newItem;
		},
		calculateBudget:function(){
			calculateTotal("inc");
			calculateTotal("exp");
			data.budget = data.totals.inc - data.totals.exp;
			data.percentage = Math.round((data.totals.exp/data.totals.inc)*100);
		},
		getBudget:()=>{
			return {
				budget:data.budget,
				percentage:data.percentage,
				totalIncome: data.totals.inc,
				totalExpenses:data.totals.exp
			}
		}
	}

})();






var UIController = (function(){
	var DomStrings = {
		inputType:".add__type",
		inputDescription:".description",
		inputValue:".value",
		inputBtn:".add__item",
		incomeList:".income-list",
		expensesList:".expenses-list",
		budget:".total-budget",
		incomeLabel:".income__label",
		expensesLabel:".expenses__label",
		percentageLabel:".percentage__label"
	}
	return {
		getInput:()=>{
			return{
				type: document.querySelector(DomStrings.inputType).value,
				description: document.querySelector(DomStrings.inputDescription).value,
				value: parseFloat(document.querySelector(DomStrings.inputValue).value)
			}
		},

		getDomString:()=>{
			return DomStrings;
		},

		addListItem:(obj,type)=>{
			let html,element;
			if(type === 'inc'){
				element = DomStrings.incomeList;
				html = `<li class="list-item"><span>${obj.description}</span> <span class="list-count"> ${obj.value} <i class="fa fa-remove" ></i></span></li>`;
			}
			else if(type == 'exp'){
				element = DomStrings.expensesList;
				html = `<li class="list-item"><span>${obj.description}</span> <span class="list-count"> ${obj.value} <i class="percentage">${obj.percentage}</i> <i class="fa fa-remove" ></i> </span></li>`;
			}

			document.querySelector(element).insertAdjacentHTML("beforeend",html);
		},

		clearFields:()=>{
			let fields = document.querySelectorAll(DomStrings.inputDescription+", "+DomStrings.inputValue);

			fields.forEach(function(item,index){
				item.value = "";
			});
		},

		displayBudget:(obj)=>{
			document.querySelector(DomStrings.budget).textContent = obj.budget;
			document.querySelector(DomStrings.incomeLabel).textContent = obj.totalIncome;
			document.querySelector(DomStrings.expensesLabel).textContent = obj.totalExpenses;
			document.querySelector(DomStrings.percentageLabel).textContent = obj.percentage+"%";
		}
	}
})();





var controller = (function(budgetCtrl,UIctrl){

	var setupEventListener=()=>{
		var DOM = UIctrl.getDomString();
		document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);
		document.addEventListener("keypress",function(event){
			if(event.keyCode == 13 || event.which == 13){
				ctrlAddItem();
			}
		});
	}



	var updateBudget = ()=>{
		budgetCtrl.calculateBudget();
		let budget = budgetCtrl.getBudget();
		UIctrl.displayBudget(budget);
	}

	
	var ctrlAddItem = ()=>{

		var input = UIctrl.getInput();

		if(input.description !== "" && !isNaN(input.value)){
			var item = budgetCtrl.addItem(input.type,input.description,input.value);
			UIctrl.addListItem(item,input.type);
			UIctrl.clearFields();
			updateBudget();
		}

		
	}


	return {
		init:()=>{
			setupEventListener();
		}
	}

	

})(budgetController,UIController);


controller.init();