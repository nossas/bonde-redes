const volunteerComment = ({
  volunteer_name,
  assignee_name,
  individual_name
}) => {
  return `Olá, ${volunteer_name}!

Boa notícia!

Viemos te contar que o seu número de atendimento acaba de ser enviado para a ${individual_name}, pois você é a voluntária disponível mais próxima.

**Para o nosso registro, é muito importante que nos avise sempre que iniciar os atendimentos. Lembre-se de que eles devem ser integralmente gratuitos e que o seu comprometimento em acolhê-la e acompanhá-la neste momento é fundamental.**

Em anexo, estamos te enviando dois documentos muito importantes: **as diretrizes de atendimento do Mapa do Acolhimento, com todas as nossas regras e valores, e a Guia do Acolhimento,** uma cartilha para te ajudar a conduzir os atendimentos da melhor forma possível.

Lembrando que, durante o período de isolamento social, **orientamos que o atendimento seja realizado de forma remota**, preferencialmente por chamada de vídeo ou telefone. Em caso de necessidade de encontro presencial, por favor, siga as recomendações de distanciamento, higiene e uso de máscara **conforme prevê a OMS**. Caso haja alguma dificuldade de realizar o acompanhamento, por favor entre em contato com a equipe imediatamente.

Além disso, também recomendamos algumas dicas de segurança:

1. **Checagem de celular e redes sociais:** tenha em mente que a sua atendida está em casa e que talvez o agressor tenha acesso ao celular/computador dela. Por isso, é importante que você a oriente a ativar a senha de bloqueio ([Android](https://u6510477.ct.sendgrid.net/ls/click?upn=n4IMFAGvtMnsFejlZFRdaiGTa35xlkBuXbyaGXmvCrqd3Vx76cDgtnZjSi2Xjw5yam68zN1qhYKA-2F-2F8zXO9zHbce-2FSoXLcqK-2F2msQ7XWR4k-3DeR4U_Om9RztAdvFAUohMYoBnHRdGSaoXqrOyVcZev2jiHJmJbZK0cg9ONRRRAzl9PK-2FpOwxNXpOWsR2f6FeeuLlZ0VbaxYye62vSoAIALKKy5l5WP2b6sklyI0oF2AG34zWrZQTlLJp9KHQM1ZzftoAlxVktzNTCzMEapeBcHI03wFVjufkru3T1zmWStFxSmHvTxcaECFaeIEHW5OkSLURg75Q-3D-3D) e [IOS](https://u6510477.ct.sendgrid.net/ls/click?upn=n4IMFAGvtMnsFejlZFRdaggktFyJzBY5eCLm-2FNIi8tzvqRKPM5b2Qmfi2mJwmNmyJ2BMUTYA-2Bcg5zFjfpjUbYnbVkWMzI6GZUMwygM0trImlVqMP-2F6fZm3WR-2FOUFjMFt0EVA5CVLmIxc2nrA3I0G3oEC-2FI3vDZcVKbrgjamlOn6lyPTsWuV-2FNb3IKUrG7N-2Fwa8Kt_Om9RztAdvFAUohMYoBnHRdGSaoXqrOyVcZev2jiHJmJbZK0cg9ONRRRAzl9PK-2FpOHpzLaYNDylEwz0JC2Z-2B8xmRx-2BHFuhFuDv6JciUrU-2FwicGtZOTunLy2WbG2L7TQqO-2BGzYXj7Elg97hASfaZla-2FUTl0mNuXuM-2BfRYGsgw0cB5ZBAc5kesyAWiflZV9dL1BtAFDPDpJ6IX6JK55-2FXKmug-3D-3D)); utilizar a autenticação dois fatores ([Whatsapp](https://u6510477.ct.sendgrid.net/ls/click?upn=n4IMFAGvtMnsFejlZFRdanibJBxpBHTBGKoV6F9G1MIm5ccvPnHPXfWZg0cvFryB5q8yVPywBtdR8NxCis0HRw-3D-3DJ52F_Om9RztAdvFAUohMYoBnHRdGSaoXqrOyVcZev2jiHJmJbZK0cg9ONRRRAzl9PK-2FpO5QG-2BvT5K9lu792m0WWsiTu3qfyehjJ8RJdBX2CA4XXlxYrpFWD21ao91WNfPTEAW0vd-2FJqugjmSCsNDXc-2FmYitAPLG6AWpRf0s2J4hWr1WGeA-2Fkicv-2B6pzBKzodXNrXy3QS16dUo8BZpP6rpwPTGvA-3D-3D), [Instagram](https://u6510477.ct.sendgrid.net/ls/click?upn=n4IMFAGvtMnsFejlZFRdam0FoCMfG4AbfaoR0F3rEnHveiC1YG-2BTpCweH-2ByxzrsXZ-2FrfHNMvKreqcwVJdB1-2BrwSW9p5tT3djASI8vPYdBMo-3Dba_q_Om9RztAdvFAUohMYoBnHRdGSaoXqrOyVcZev2jiHJmJbZK0cg9ONRRRAzl9PK-2FpO28N2IXbwJysTL3XLiGO0NKIF-2Bc5ti1OUHGBPm7jPdTZYjySFpZYvnswJh2amzSHPCOlohV8UaELZFwRSuj1tOIxfiNgOTifCdig1WaK7-2FeFx7jkWqco-2BNsA7SaqLk6oSQt1xWMTMNBVR0Fb2jzT3ww-3D-3D) e [Facebook](https://u6510477.ct.sendgrid.net/ls/click?upn=n4IMFAGvtMnsFejlZFRdaqf8wqxnK2yXkZUjMYl91y7l-2F-2BeJjqdOx81Lh0bkxmWJF3R9LmNd6PIH6U1kNkMxR13-2Fv6uiIKYBnZ7Scd-2Bhejc-3Da05q_Om9RztAdvFAUohMYoBnHRdGSaoXqrOyVcZev2jiHJmJbZK0cg9ONRRRAzl9PK-2FpOAIWhkQeYZpDgVYlXA-2FDxqoWT7DMtt7qrf-2Ba2fRRtIHmG4b-2Foa6gMNWwyCgx27qI3YLC3mAz3EbhtP0zqS-2F6cn2PGhHkovsmDOvgye-2F3-2BjY6xEpv8DGCOcdwY-2FswCk1XSDS2UVqwOmiu3hbnjxqvTXQ-3D-3D)); verificar os dispositivos conectados ao [Whatsapp web](https://u6510477.ct.sendgrid.net/ls/click?upn=n4IMFAGvtMnsFejlZFRdatgYt1VFTIcKZUpSLtMk4yPH-2BYrOqE8D0YYa94MhwqBTPj5-2Bh0fIfjwENfZY78xTlR6W3srMbvEHvy2IySW6zgd57K8c9k1XzuldeVeT5LRsINt3_Om9RztAdvFAUohMYoBnHRdGSaoXqrOyVcZev2jiHJmJbZK0cg9ONRRRAzl9PK-2FpO1WI0vq4yUElaBMf8TIuSRPBFf9rWqN25cOHa5kOibfhB-2BjXIG1nwmIbc7yj-2FQ2fn230xP2xTjZ-2F6N7cZ5YyyZByDcRQNnchhHeRK9ouLAh1ucl-2BtYHPlO61mauiLjcfih6Yjq-2Bh2kJ9CePs5TNBDng-3D-3D) e [Facebook](https://u6510477.ct.sendgrid.net/ls/click?upn=n4IMFAGvtMnsFejlZFRdaggktFyJzBY5eCLm-2FNIi8tzvqRKPM5b2Qmfi2mJwmNmyJ2BMUTYA-2Bcg5zFjfpjUbYtV-2BlyshtmsBpsuBUeHUNDmO-2B4O1FNREjOUskM-2FWxjAxrp8Mim2a7vgXJWQpeMmW-2FmuVAqw97fFTN8DAon4sZf7X02K293yOWqwY4kmwRCSX0u8t_Om9RztAdvFAUohMYoBnHRdGSaoXqrOyVcZev2jiHJmJbZK0cg9ONRRRAzl9PK-2FpO3pJP-2FEkaodNtLHwp-2FWue54NFZ0OKkxSIXWXuWE7X-2Ft2F9Avov3TRedFW7e3WLBBKfgYrr7hcJHBMrm8USz5X4qtE-2FTk04hs-2BP-2BNM3ROmByR0ssEBnyO0-2BMqmDTkk04bbkwEp7qyM1QFIkrlhfPKKlQ-3D-3D).

2. **Comunicação online com a atendida:** indicamos o uso do site [meet.jit.si](https://u6510477.ct.sendgrid.net/ls/click?upn=n4IMFAGvtMnsFejlZFRdascF3kZTQaqkvyb7xh6S19s-3DznOF_Om9RztAdvFAUohMYoBnHRdGSaoXqrOyVcZev2jiHJmJbZK0cg9ONRRRAzl9PK-2FpO3w8zKN20jttn1cHBxCgPpV8op7-2BHfUecZBB3NxSWhPZSRSD-2BlM9WU-2Ff-2Fq2Q4auBnn69eW2-2FN8B3I9T5m2fzN-2BDR5YfR9hDZLBVwy9h4PVu1vxwFNdJuLsNMwsNGJcwSshb7g67epo6Wl6kG2MOl4TA-3D-3D) (ou no celular [baixar o app](https://u6510477.ct.sendgrid.net/ls/click?upn=n4IMFAGvtMnsFejlZFRdatsiK3BMo0IGCpi5STOE1TQ8OecgPUUFcx2UqDyZUz0F-dgv_Om9RztAdvFAUohMYoBnHRdGSaoXqrOyVcZev2jiHJmJbZK0cg9ONRRRAzl9PK-2FpOeOdW-2FIEi-2B0-2BBGx2DvegLfaEYahGNQUaT-2BDkm1AqMCGuhVO3-2BnnY9JCwotYjeFXr4CO8EnjjkR7KwzpvVUiU3tPS4-2FevmyMUEJ7VawIRjUAyyyakaHmIiICkjjir6NOVVs034uN-2FkFqGnz9aYvV8y2A-3D-3D)), que permite conversas de voz ou vídeo de forma criptografada. Para usar basta abrir o site e substituir o "nomedasala" pelo nome que quiser depois da barra da URL. Ex: [meet.jit.si/nomedasala](http://meet.jit.si/nomedasala) -> [meet.jit.si/reuniao](http://meet.jit.si/reuniao)

3. **Comunicação em situação de vigilância**: combine com a mulher atendida algumas formas de comunicar uma emergência. Ex: "emojis" específicos para pedir ajuda, como flor= preciso sair de casa, fruta= ele está me agredindo.

Qualquer dúvida ou dificuldade, por favor nos comunique.

É muito bom saber que podemos contar com você!

Um abraço,


${assignee_name} do Mapa do Acolhimento`;
};

export default volunteerComment;
