//本质上我们在做的就三个东西：
//1.停车场（n个车位，属于一个栈（LIFO））
//2，便道（m个车位，属于一个队列（FIFO））
//3. 临时让路处（停车场里面的车子要出来得让位置，现实中就是把车先开出来然后再开进去）

#include <iostream>
#include <stack>//引入栈头文件
#include <queue>//引入队列头文件
#include <string>
#include <ctime>//时间库
#include <iomanip>//提供了对输入/输出流的格式化操作
using namespace std;

struct Car {
	string id;//车牌号
	time_t parkTime = 0;//停车时间
};

string formatTime(time_t t) {
	char buf[10];
	struct tm* timeinfo = localtime(&t);
	strftime(buf, sizeof(buf), "%H:%M:%S", timeinfo);
	return string(buf);
}

class ParkManager {
private:
	int capacity;//停车场容量
	float pricePerMinute;//停车场的费用
	stack<Car> parkingLot;//停车场，栈结构
	queue<Car> waitingLine;//便道，队列结构

public:
	ParkManager(int n, float p) : capacity(n), pricePerMinute(p) {}

	void arrive(string id) {
		time_t now = time(0);
		Car newCar = { id, now };
		if (parkingLot.size() < (size_t)capacity) {
			parkingLot.push(newCar);
			cout << "车辆" << id << "已进入停车场, 停放在" << parkingLot.size() << "号车位。" << endl;
		}
		else {
			waitingLine.push(newCar);
			cout << "停车场已满，车辆" << id << "进入便道等待,目前排位" << waitingLine.size() << endl;
		}
	}

	void depart(string id) {
		stack<Car> buffer;//临时缓冲区，用于存放让路的车辆
		bool found = false;
		Car targetCar;
		time_t now = time(0);

		//在停车场中寻找要离开的车辆
		while (!parkingLot.empty()) {
			if (parkingLot.top().id == id) {
				targetCar = parkingLot.top();
				parkingLot.pop();
				found = true;
				break;
			}
			//将不离开的车辆暂时开出去（存进缓冲区）
			cout << "车辆" << parkingLot.top().id << "让路，暂时驶出停车场。" << endl;
			buffer.push(parkingLot.top());
			parkingLot.pop();
		}

		if (found) {
			double seconds = difftime(now, targetCar.parkTime);
			float cost = (seconds / 60.0) * pricePerMinute;

			cout << "\n-----------------------------------" << endl;
			cout << ">>> [出场] 车辆: " << id << endl;
			cout << ">>> 进入时间: " << formatTime(targetCar.parkTime) << endl;
			cout << ">>> 离开时间: " << formatTime(now) << endl;
			cout << ">>> 停留时长: " << (int)seconds << " 秒" << endl;
			cout << ">>> 应缴费用: " << fixed << setprecision(2) << cost << " 元" << endl;
			cout << "-----------------------------------\n" << endl;

			while (!buffer.empty()) {
				parkingLot.push(buffer.top());
				buffer.pop();
			}

			//如果便道上有车，安排一辆车进入停车场
			if (!waitingLine.empty()) {
				Car nextCar = waitingLine.front();
				waitingLine.pop();
				nextCar.parkTime = now; //更新停车时间为当前时间
				parkingLot.push(nextCar);
				cout << "车辆" << nextCar.id << "从便道进入停车场, 停放在" << parkingLot.size() << "号车位。" << endl;
			}
		}
		else {
			// 还原栈
			while (!buffer.empty()) {
				parkingLot.push(buffer.top());
				buffer.pop();
			}
			cout << ">>> 未在场内找到车辆 " << id << endl;
		}
	}

	bool removeFormWaitingLine(string id) {
		int size = waitingLine.size();
		bool removed = false;
		for (int i = 0; i < size; ++i) {
			Car c = waitingLine.front();
			waitingLine.pop();
			if (c.id == id && !removed) {
				removed = true;
			}
			else {
				waitingLine.push(c);
			}
		}
		return removed;
	}

	void displayStatus() {
		cout << "\n--- 当前状态 ---" << endl;
		cout << "停车场 (" << parkingLot.size() << "/" << capacity << "): ";
		stack<Car> temp = parkingLot;
		if (temp.empty()) cout << "[空]";
		while (!temp.empty()) {
			cout << "[" << temp.top().id << "] ";
			temp.pop();
		}
		cout << "\n便道等待: ";
		queue<Car> qTemp = waitingLine;
		if (qTemp.empty()) cout << "[空]";
		while (!qTemp.empty()) {
			cout << "(" << qTemp.front().id << ") ";
			qTemp.pop();
		}
		cout << "\n----------------\n" << endl;
	}
};

int main() {
	int n;
	float p;
	cout << "请输入停车场最大容量 n: ";
	cin >> n;
	cout << "请输入每分钟收费单价: ";
	cin >> p;

	ParkManager pm(n, p); 

	char cmd;
	string id;

	cout << "\n--- 实时时间停车场管理系统已启动 ---" << endl;
	cout << "指令说明: A到达 | D离开 | P查看状态 | Q退出" << endl;

	while (true) {
		cout << "\n请输入指令: ";
		cin >> cmd;
		if (cmd == 'Q' || cmd == 'q') break;

		if (cmd == 'A' || cmd == 'a') {
			cout << "车牌号: ";
			cin >> id;
			pm.arrive(id);
		}
		else if (cmd == 'D' || cmd == 'd') {
			cout << "车牌号: ";
			cin >> id;
			pm.depart(id);
		}
		else if (cmd == 'P' || cmd == 'p') {
			pm.displayStatus();
		}
	}
	return 0;
}