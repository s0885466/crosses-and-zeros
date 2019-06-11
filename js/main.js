/**
 * Методы:
 * 1. resetData(allReset = false) - сбрасывает данные массивов игроков и счетчик ходов,
 * в случае передачи второго аргумента true сбрасывает счетчик побед игроков.
 * 2. resetWin() - сбрасывает счетчик побед игроков
 * 3. renderField() - отрисовывает поле игры в div id="field
 * 4. changeMessage(name) - отрисовывает чей сейчас ход в div id="message"
 * 5. changeScore() - отрисовывает счет игроков
 * 6. clickField() - задает обработчик события клика по полю div id="field c всплытием события
 * в функции есть похожий код, но думаю, что тут нет смысла выносить его в отдельную функцию
 **/

class Game {
    constructor(name1, name2) {
        this.win = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ];

        this.player = {
            player1:{
                name: name1,
                data: [],
                win: 0
            },
            player2:{
                name: name2,
                data: [],
                win: 0
            },
        };

        this.counter = 1;

        const {player1, player2} =  this.player;

        this.renderField();
        this.changeMessage(player1.name);
        this.changeScore();
        this.clickField();
        this.clickReset(player1.name);
    };

    resetData(allReset = false){
        const {player1, player2} =  this.player;
        player1.data = [];
        player2.data = [];
        this.counter = 1;

        if (allReset) {
            this.resetWin();
            this.changeScore();
        }

        this.renderField();
    }

    resetWin(){
        const {player1, player2} = this.player;
        player1.win = 0;
        player2.win = 0;
    }

    renderField(){
        const field = document.getElementById('field');
        console.log('field:',field);
        field.innerHTML = `
        <div class="row no-gutters">
            <div class="col"><div class="min-field" data-id="0"></div></div>
            <div class="col"><div class="min-field" data-id="1"></div></div>
            <div class="col"><div class="min-field" data-id="2"></div></div>
        </div>
            <div class="row no-gutters">
            <div class="col"><div class="min-field" data-id="3"></div></div>
            <div class="col"><div class="min-field" data-id="4"></div></div>
            <div class="col"><div class="min-field" data-id="5"></div></div>
        </div>
            <div class="row no-gutters">
            <div class="col"><div class="min-field" data-id="6"></div></div>
            <div class="col"><div class="min-field" data-id="7"></div></div>
            <div class="col"><div class="min-field" data-id="8"></div></div>
        </div>
        `;
    }

    changeMessage(name){
        const message = document.getElementById('message');
        message.innerHTML = `move ${name}`;
    };

    changeScore(){
        const {player1, player2} = this.player;
        const score = document.getElementById('score');
        score.innerHTML = `${player1.name} ${player1.win} :
        ${player2.win} ${player2.name}`;
    };

    clickField(){
        const {player1, player2} = this.player;

        document.getElementById('field')
            .addEventListener('click',
                (e) => {
                    const target = e.target;
                    const dataId = target.getAttribute('data-id');
                    //Если игрок ткнул в поле повторно, то выходим из события
                    if ((target.innerHTML === 'x')||(target.innerHTML === 'o')){
                        return;
                    }
                    //в зависимости от четности счетчика хода
                    if (this.counter % 2 !== 0){
                        target.innerHTML = 'x';
                        player1.data.push(+dataId);

                        if (this.isWin(dataId, 'player1')){
                            player1.win++;
                            this.changeScore();
                            this.resetData();
                        }

                        this.changeMessage(player2.name);

                    } else {
                        target.innerHTML = 'o';
                        player2.data.push(+dataId);

                        if (this.isWin(dataId, 'player2')){
                            player2.win++;
                            this.changeScore();
                            this.resetData();
                        }

                        this.changeMessage(player1.name);
                    }

                    this.counter++;
                    if (this.counter > 9 ) {
                        setTimeout(
                            () => {
                                this.resetData();
                                this.changeMessage(player1.name);
                            },1000);
                    }
                });
    };

    isWin(number, name){

        const arr = this.player[name].data;
        const sortArr = this.win.filter(el => el.indexOf(+number) !== -1 );
        console.log('sortArr ', sortArr);
        console.log('arr ', arr);

        let count = 0;
        sortArr.forEach((el) => {
            arr.forEach(elem => {
                if (el.indexOf(elem)!==-1) count++;
            });
            //не знаю как выходить из таких циклов, поэтому костыль
            count = (count < 3)? 0 : count;
        });
        return (count > 2) ? true : false;
    }

    clickReset(name){
        document.getElementById('btn')
            .addEventListener('click',
                () => {
                this.resetData(true);
                this.changeMessage(name);
                }
                );
    };
}

const game = new Game('Sergey', 'Victor');



