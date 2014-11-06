#include <SPI.h>

#include <Ethernet.h>
#include <EthernetServer.h>
#include <Dns.h>
#include <Dhcp.h>
#include <EthernetClient.h>
#include <util.h>
#include <EthernetUdp.h>


byte mac[]={0xDE,0xAD,0xBE,0xEF,0xFE,0xED}; //MAC
IPAddress ip(192,168,1,100); //IP
EthernetServer servidor(80);

void setup(){
  Ethernet.begin(mac, ip); //Inicializamos con las direcciones asignadas
  servidor.begin();
}
void loop(){
  EthernetClient cliente= servidor.available();
  
  if(cliente)
  {
    boolean lineaenblanco=true;
    while(cliente.connected())//Cliente conectado
    {
      if(cliente.available())
      {
        char c=cliente.read();
        if(c=='\n' && lineaenblanco)//Si la petición HTTP ha finalizado
        {
          cliente.println("HTTP/1.1 200 OK");
          cliente.println("Content-Type: text/html");
          cliente.println();
          
          cliente.println("Hello World");
          cliente.stop();
        }
      }
    }
  }       
}
