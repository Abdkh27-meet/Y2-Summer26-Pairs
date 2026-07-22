import os
from dotenv import load_dotenv
from anthropic import Anthropic

load_dotenv()

client = Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))

from app1 import get_reply as entropo_reply, system_message as entropo_system, save_specific_content_to_pdf
from app2 import get_reply as cs_reply, system_message as cs_system
from app3 import get_reply as kazuha_reply, system_message as kazuha_system

# Each agent gets its own history so their memories don't mix
entropo_history = []
cs_history = []
kazuha_history = []

print("Type:\n @entropo, or\n @cs,\n or @kazuha \n to start chatting with that agent.")
print("\n Once inside a chat, type 'exit' to leave and pick a different agent.")
print("\n Type 'exit' here at the main menu to quit completely.\n")

while True:
    user_input = input('>> ')

    if user_input.lower() == 'exit':
        print("Goodbye!")
        break

    # Figure out which agent to enter, based on the @tag
    if user_input.lower() == '@entropo':
        agent_name = "Entropo"
        reply_func = entropo_reply
        history = entropo_history
        system_message = entropo_system
    elif user_input.lower() == '@cs':
        agent_name = "Carmelo Sean"
        reply_func = cs_reply
        history = cs_history
        system_message = cs_system
    elif user_input.lower() == '@kazuha':
        agent_name = "Kazuha"
        reply_func = kazuha_reply
        history = kazuha_history
        system_message = kazuha_system
    else:
        print("Please type @entropo, @cs, or @kazuha to start a chat.")
        continue

    print(f"\n--- Now chatting with {agent_name}. Type 'exit' to leave this chat. ---\n")

    # Inner loop: stay in this agent's chat until the user types exit
    while True:
        message = input('user: >> ')

        if message.lower() == 'exit':
            print(f"--- Left {agent_name}'s chat. Back to the main menu. ---\n")
            break

        # Check for the save command before sending to the agent
        if message.lower().startswith('save'):
            topic = message[4:].strip()  # cuts off "save", leaving just the topic

            if not topic:
                print('Please tell me what to save, e.g. "save explain customer discovery"')
                continue

            # Ask the CURRENT agent to answer this one topic, separate from the ongoing history,
            # so nothing else from the conversation ends up in the PDF
            response = client.messages.create(
                model='claude-haiku-4-5-20251001',
                max_tokens=2000,
                temperature=1,
                system=system_message,
                messages=[{'role': 'user', 'content': topic}]
            )
            content_to_save = response.content[0].text

            path = save_specific_content_to_pdf(title=topic, content=content_to_save)
            print(f'Saved to {path}')
            continue

        reply = reply_func(message, history, system_message)
     


       # If a handoff was requested, get a second opinion from that agent
        
         # Check if the agent's reply contains a handoff tag (e.g. "HANDOFF: cs")
       # Check if the agent requested a handoff
        handoff_agent = None

        if "HANDOFF:" in reply:
            main_reply, handoff_line = reply.rsplit("HANDOFF:", 1)
            main_reply = main_reply.strip()
            handoff_agent = handoff_line.strip().lower()
        else:
            main_reply = reply

        # Print the current agent's response
        print(f"{agent_name}: {main_reply}")

        # If a handoff was requested, send BOTH the user's question and
        # the previous agent's reply to the next agent.
        if handoff_agent:

            handoff_message = f"""
        The user asked:
        {message}

        The previous agent replied:
        {main_reply}

        Continue helping the user. Do not repeat what the previous agent already explained.
        """

            if handoff_agent == "entropo" and agent_name != "Entropo":
                print(f"\n🔄 {agent_name} is bringing in Entropo for a second opinion...\n")
                second_reply = entropo_reply(handoff_message, entropo_history, entropo_system)
                print(f"Entropo (second opinion): {second_reply}")

            elif handoff_agent == "cs" and agent_name != "Carmelo Sean":
                print(f"\n🔄 {agent_name} is bringing in Carmelo Sean for a second opinion...\n")
                second_reply = cs_reply(handoff_message, cs_history, cs_system)
                print(f"Carmelo Sean (second opinion): {second_reply}")

            elif handoff_agent == "kazuha" and agent_name != "Kazuha":
                print(f"\n🔄 {agent_name} is bringing in Kazuha for a second opinion...\n")
                second_reply = kazuha_reply(handoff_message, kazuha_history, kazuha_system)
                print(f"Kazuha (second opinion): {second_reply}")