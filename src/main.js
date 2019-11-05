var vm = new Vue({
    el:'#app',
    data:{
        instructions:[
                        {id:'0',value:'00000000000000010001000000100000'},
                        {id:'1',value:'00000000000000100001000000100000'},
                        {id:'2',value:'00000000000000010001000000100000'},
                        {id:'3',value:'00000000000000010001000000100000'},
                    ],
        pc:0,
        id:0,
        if_id:'0',
        if_idInstructionId:'',
        registers:[],
        memory:[],
        id_ex:{
            new:{
                rs:'',
                rt:'',
                rd:'',
                im:'',
                option:'',
                func:'',
                inst:'',
                type:''
                },
        },
        ex_mem:{
            new:{
                option:'',
                type:'',
                rd:'',
                im:'',
                ans:'',
                inst:'',
                memread:false,
                memwrite:false
                }
        },
        mem_wb:{
            option:'',
            rd:'',
            im:'',
            ans:'',
            inst:'',
            type:''
        },
        midData:{
            instId:'',
            instValue:'',
            registerId:'',
            registerValue:'',
            memId:'',
            memValue:''
        }
    },
   
    methods:{

        <!-- if stage,get instruction -->
        if(){
           this.if_id  = this.instructions[this.pc].value;
           this.if_idInstructionId = this.pc;
        },



         <!-- id stage,get rs、rt、rd、or imm -->


        register(){                                 
            var instruction = this.if_id;
            var op = instruction.substr(0,6);
            switch(op){
                case '000000' :this.id_r_instruction(instruction);  break;          <!-- R type -->

                case '000010' :this.id_j_instruction(instruction);  break;          <!-- J type -->

                case '001000' :this.id_i_instruction(instruction);  break;          <!-- I type -->
                case '001010' :this.id_i_instruction(instruction);  break;
                case '001100' :this.id_i_instruction(instruction);  break;
                case '001101' :this.id_i_instruction(instruction);  break;
                case '100011' :this.id_i_instruction(instruction);  break;
                case '101011' :this.id_i_instruction(instruction);  break;
            }
        },


        id_r_instruction(instruction){
            this.id_ex.new.rs = this.registers[parseInt(instruction.substr(6,5),2)].value;
            this.id_ex.new.rt = this.registers[parseInt(instruction.substr(11,5),2)].value;
            this.id_ex.new.rd = parseInt(instruction.substr(16,5),2);
            this.id_ex.new.func = instruction.substr(26,6);
            this.id_ex.new.type = 'r';
        },
        id_i_instruction(instruction){
            this.id_ex.new.rs = this.registers[parseInt(instruction.substr(6,5),2)].value;
            this.id_ex.new.rt = parseInt(instruction.substr(11,5),2);
            this.id_ex.new.option = instruction.substr(0,6);
            this.id_ex.new.im = parseInt(instruction.substr(16,16),2);
            this.id_ex.new.type = 'i';
        },
        id_j_instruction(instruction){
            this.id_ex.new.im = parseInt(instruction.substr(6,26),2);
            this.pc = this.pc + this.id_ex.new.im;
            this.id_ex.new.type = 'j';
        },




        <!-- alu/ex stage -->




        alu(){
            switch(this.id_ex.new.type){
                case 'r': this.ex_r_instruction();break;
                case 'i': this.ex_i_instruction();break;
                case 'j': this.ex_j_instruction();break;
            }
        },
        ex_r_instruction(){
            <!-- r type in ex -->
            var func = this.id_ex.new.func;
            <!-- console.log(func); -->
            switch(func){
                case '100000':{
                    var ans = this.id_ex.new.rs + this.id_ex.new.rt;
                    this.ex_mem.new.ans = ans;
                    this.ex_mem.new.type = 'r';
                    this.ex_mem.new.rd = this.id_ex.new.rd;
                    this.ex_mem.new.inst = this.id_ex.new.inst;
                };break;
                <!-- rd = rs+rd -->
                case '100010':{
                    var ans = this.id_ex.new.rs - this.id_ex.new.rt;
                    this.ex_mem.new.ans = ans;
                    this.ex_mem.new.type = 'r';
                    this.ex_mem.new.rd = this.id_ex.new.rd;
                    this.ex_mem.new.inst = this.id_ex.new.inst;
                };break;
                <!-- rd=rs-rt -->
                case '101010':{
                    var ans = (this.id_ex.new.rs - this.id_ex.new.rt)?1:0;
                    this.ex_mem.new.ans = ans;
                    this.ex_mem.new.type = 'r';
                    this.ex_mem.new.rd = this.id_ex.new.rd;
                    this.ex_mem.new.inst = this.id_ex.new.inst;
                };break;
                <!-- rd=(rs<rt)?1:0 -->
                case '100100':{
                    var ans;
                    var rs = this.id_ex.new.rs.toString(2).padStart(6,'0');
                    var rt = this.id_ex.new.rt.toString(2).padStart(6,'0');
                    ans = rs&&rt;
                    this.ex_mem.new.ans = parseInt(ans,2);
                    this.ex_mem.new.type = 'r';
                    this.ex_mem.new.rd = this.id_ex.new.rd;
                    this.ex_mem.new.inst = this.id_ex.new.inst;
                };break;
                <!-- rd=rs&rt -->
                case '100101':{
                    var ans;
                    var rs = this.id_ex.new.rs.toString(2).padStart(6,'0');
                    var rt = this.id_ex.new.rt.toString(2).padStart(6,'0');
                    ans = rs||rt;
                    this.ex_mem.new.ans = parseInt(ans,2);
                    this.ex_mem.new.type = 'r';
                    this.ex_mem.new.rd = this.id_ex.new.rd;
                    this.ex_mem.new.inst = this.id_ex.new.inst;
                };break;
                <!-- rd=rs|rt -->
            }
        },
        ex_i_instruction(){
            var option = this.id_ex.new.option;
            switch(option){
                case '001000':{
                    var ans = this.id_ex.new.rs + this.id_ex.new.im;
                    this.ex_mem.new.ans = ans;
                    this.ex_mem.new.option = this.id_ex.new.option;
                    this.ex_mem.new.rd = this.id_ex.new.rt;
                    this.ex_mem.new.type = 'i';
                    this.ex_mem.new.inst = this.id_ex.new.inst;
                } break;
                <!-- rt=rs+im -->
                case '001010':{
                    var ans;
                    if((this.id_ex.new.rs - this.id_ex.new.im) < 0)
                        ans = 1;
                    else 
                        ans = 0;
                    this.ex_mem.new.option = this.id_ex.new.option;
                    this.ex_mem.new.ans = ans;
                    this.ex_mem.new.rd = this.id_ex.new.rt;
                    this.ex_mem.new.type = 'i';
                    this.ex_mem.new.inst = this.id_ex.new.inst;
                } break;
                <!-- rt=(rs<im)?1:0 -->
                case '001100':{
                    var a = this.id_ex.new.rs.toString(2).padStart(6,'0');
                    var b = this.id_ex.new.im.toString(2).padStart(6,'0');
                    var ans;
                    ans = a&&b;
                    this.ex_mem.new.option = this.id_ex.new.option;
                    this.ex_mem.new.ans = parseInt(ans,2);
                    this.ex_mem.new.rd = this.id_ex.new.rt;
                    this.ex_mem.new.type = 'i';
                    this.ex_mem.new.inst = this.id_ex.new.inst;
                } break;
                <!-- rt=rs&im -->
                case '001101':{
                    var a = this.id_ex.new.rs.toString(2).padStart(6,'0');
                    var b = this.id_ex.new.im.toString(2).padStart(6,'0');
                    var ans;
                    ans = a||b;
                    this.ex_mem.new.option = this.id_ex.new.option;
                    this.ex_mem.new.ans = parseInt(ans,2);
                    this.ex_mem.new.rd = this.id_ex.new.rt;
                    this.ex_mem.new.type = 'i';
                    this.ex_mem.new.inst = this.id_ex.new.inst;
                } break;
                <!-- rt=rs|im -->
                case '100011':{
                    var ans = this.id_ex.new.rs +this.id_ex.new.im;
                    <!-- ans记录将要读取的存储区的位置 -->
                    this.ex_mem.new.memread = true;
                    this.ex_mem.new.option = this.id_ex.new.option;
                    this.ex_mem.new.ans = ans;
                    this.ex_mem.new.rd = this.id_ex.new.rt;
                    this.ex_mem.new.type = 'i';
                    this.ex_mem.new.inst = this.id_ex.new.inst;
                } break;
                <!-- rt=men[rs+im] -->
                case '101011':{
                    var ans =this.id_ex.new.rs + this.id_ex.new.im;
                    this.ex_mem.new.rd = ans;
                    <!-- rd寄存器记录将要存放在存储区的哪个位置 -->
                    this.ex_mem.new.memwrite = true;
                    this.ex_mem.new.ans = this.registers[parseInt(this.id_ex.new.rt,2)].value;
                    <!-- ex_mem寄存器ans字段记录需要存放的数据 -->
                    this.ex_mem.new.type = 'i';
                    this.ex_mem.new.option = this.id_ex.new.option;
                    this.ex_mem.new.inst = this.id_ex.new.inst;
                } break;
                <!-- mem[rs+im]=rd -->
            }
        },
        ex_j_instruction(){
            this.ex_mem.new.type = 'j';
            this.ex_mem.new.inst = this.id_ex.new.inst;
            this.ex_mem.new.im = this.id_ex.new.im;
            <!-- this.pc = this.pc + this.id_ex.new.im; -->
        },


        <!-- mem stage,read/store -->
        mem(){
            switch(this.ex_mem.new.type){
                case 'r': this.mem_r_instruction();break;
                case 'i': this.mem_i_instruction();break;
                case 'j': this.mem_j_instruction();break;
            }
        },
        mem_r_instruction(){
            <!-- console.log('test') -->
            this.mem_wb.ans = this.ex_mem.new.ans;
            this.mem_wb.rd = this.ex_mem.new.rd;
            this.mem_wb.type = 'r';
            this.mem_wb.option = this.ex_mem.new.option;
            this.mem_wb.inst = this.ex_mem.new.inst;
        },
        mem_j_instruction(){
            this.mem_wb.im = this.ex_mem.new.im;
            this.mem_wb.type = 'j';
            this.mem_wb.option = this.ex_mem.new.option;
            this.mem_wb.inst = this.ex_mem.new.inst;
        },
        mem_i_instruction(){
            var memread = this.ex_mem.new.memread;
            var memwrite = this.ex_mem.new.memwrite;
            if(memread){
                ans = this.memory[this.ex_mem.new.ans].value;
                this.mem_wb.ans = ans;
                this.mem_wb.rd = this.ex_mem.new.rd;
                <!-- rd=mem[rs+im] -->
                this.mem_wb.type = 'i';
                this.mem_wb.option = this.ex_mem.new.option;
                this.mem_wb.inst = this.ex_mem.new.inst;
                this.ex_mem.new.memread = false;
                return;
            };
            if(memwrite){
                <!-- mem[rs+im]=rt -->
                this.memory[this.ex_mem.new.rd].value = this.ex_mem.new.ans; 
                this.ex_mem.new.memwrite = false;
                this.mem_wb.type = 'i';
                this.mem_wb.option = this.ex_mem.new.option;
                this.mem_wb.inst = this.ex_mem.new.inst;
                return;
            };
            this.mem_wb.ans = this.ex_mem.new.ans;
            this.mem_wb.rd = this.ex_mem.new.rd;
            this.mem_wb.type = 'i';
            this.mem_wb.option = this.ex_mem.new.option;
            this.mem_wb.inst = this.ex_mem.new.inst;
        },



    <!-- wb stage,write back to register  -->



    wb(){
        switch(this.mem_wb.type){
            case 'r':this.wb_r_instruction(); break;
            case 'i':this.wb_i_instruction(); break;
            case 'j':this.wb_j_instruction(); break;
        }
    },
    wb_r_instruction(){
        <!-- console.log('test'); -->
        <!-- console.log(this.mem_wb.rd); -->
        this.registers[this.mem_wb.rd].value = this.mem_wb.ans;
    },
    wb_i_instruction(){
        if(this.mem_wb.option === '101011')
                return;
        else
            this.registers[this.mem_wb.rd].value = this.mem_wb.ans;
    },
    wb_j_instruction(){
        return;
    },


    run_onestep(){
        this.wb();
        this.mem();
        this.alu();
        this.register();
        this.if();
        this.pc=this.pc+1;
    },
    addInstruction(){
        var newInst;
        newInst={id:this.midData.instId,value:this.midData.instValue};
        this.instructions.push(newInst);
        this.midData.instId = '';
        this.midData.instValue = '';
    },
    delInst(key){
        var id;
        id = this.instructions.findIndex(function(val){
             if (val.id === key)
             return true;
        });
        this.instructions.splice(id,1);
    },
    registerInit(){
        this.registers[this.midData.registerId].value = this.midData.registerValue;
        this.midData.registerId = '';
        this.midData.registerValue = '';
    },
    memInit(){
        this.memory[this.midData.memId].value = this.midData.memValue;
        this.midData.memId = '';
        this.midData.memValue = '';
    }


    },<!-- methods结束符 -->
    created(){
        for(var i=0 ; i < 32 ;i++){
            this.registers.push({id:i,value:parseInt(Math.random()*10)})
        }
              <!-- 寄存器初始化  -->
        for(var i=0;i < 50;i++){
            this.memory.push({id:i,value:parseInt(Math.random()*10)});
        }
             <!-- 存储区初始化 -->
    }
})