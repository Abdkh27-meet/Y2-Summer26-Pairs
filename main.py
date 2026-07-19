

from app1 import run_chat as CS_agent
from app2 import run_chat as Entropo_agent
from app3 import run_chat as caza_agent

while True:
    print("Welcome to the AI Agent Selector!")
    print("Please choose an agent to interact with:")
    print("1. CS Agent (Carmelo Sean)")
    print("2. Entrep Agent (Entropo)")
    print("3. Creativity Agent (Kazuha) \n")

    Descision = input("Enter the number of the agent you want to interact with (or type 'exit' to quit): ")
    if Descision == "1":
        CS_agent()
    elif Descision == "2":
        Entropo_agent()
    elif Descision == "3":
        caza_agent()
    elif Descision.lower() == "exit":
        print("Exiting the AI Agent Selector. Goodbye!")
        break

    else:
        print ("Invalid agent, choose again")

        





