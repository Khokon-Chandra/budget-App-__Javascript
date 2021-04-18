

var budgetController = (function(){

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

	let allIncomes = [];
	let allExpenses = [];
	let totalExpenses = 0;

	let data={
		allItems:{
			inc:[],
			exp:[]
		},
		totals:{
			inc:0,
			exp:0
		}
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
		expensesList:".expenses-list"
	}
	return {
		getInput:()=>{
			return{
				type:document.querySelector(DomStrings.inputType).value,
				description: document.querySelector(DomStrings.inputDescription).value,
				value: document.querySelector(DomStrings.inputValue).value
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
				html = `<li class="list-item"><span>${obj.description}</span> <span class="list-count"> ${obj.value} <i class="percentage">30%</i> <i class="fa fa-remove" ></i> </span></li>`;
			}

			document.querySelector(element).insertAdjacentHTML("beforeend",html);
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

	
	var ctrlAddItem = ()=>{

		var input = UIctrl.getInput();

		var item = budgetCtrl.addItem(input.type,input.description,input.value);

		UIctrl.addListItem(item,input.type);
		
	}


	return {
		init:()=>{
			setupEventListener();
		}
	}

	

})(budgetController,UIController);


controller.init();